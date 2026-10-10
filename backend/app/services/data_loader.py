
import pandas as pd
from fastapi import UploadFile, HTTPException


async def load_financial_file(file: UploadFile) -> pd.DataFrame:
    """
    Read an uploaded CSV or Excel file and return its contents
    as a Pandas DataFrame.
    """

    filename = (file.filename or "").lower()

    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(file.file)

        elif filename.endswith(".xlsx"):
            df = pd.read_excel(file.file, engine="openpyxl")

        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file format. Upload a CSV or XLSX file.",
            )

        if df.empty:
            raise HTTPException(
                status_code=400,
                detail="The uploaded file contains no data.",
            )

        return df

    except HTTPException:
        raise

    except (ValueError, pd.errors.ParserError, OSError) as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Could not read the uploaded file: {exc}",
        ) from exc

    finally:
        await file.close()
        