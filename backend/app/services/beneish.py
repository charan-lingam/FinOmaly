def safe_div(n, d):
    if d is None or n is None or float(d) == 0:
        return None
    return float(n) / float(d)

def calculate_m_score(curr, prev):
    results = {
        "dsri": None, "gmi": None, "aqi": None, "sgi": None,
        "depi": None, "sgai": None, "lvgi": None, "tata": None,
        "m_score": None, "is_manipulator": None
    }
    
    if not curr or not prev:
        return results

    # 1. DSRI (Days Sales in Receivables Index)
    curr_dsr = safe_div(curr.accounts_receivable, curr.net_sales)
    prev_dsr = safe_div(prev.accounts_receivable, prev.net_sales)
    results['dsri'] = safe_div(curr_dsr, prev_dsr)

    # 2. GMI (Gross Margin Index)
    if prev.net_sales is not None and prev.cogs is not None and curr.net_sales is not None and curr.cogs is not None:
        prev_gm = safe_div(float(prev.net_sales) - float(prev.cogs), prev.net_sales)
        curr_gm = safe_div(float(curr.net_sales) - float(curr.cogs), curr.net_sales)
        results['gmi'] = safe_div(prev_gm, curr_gm)

    # 3. AQI (Asset Quality Index)
    if curr.current_assets is not None and curr.ppe is not None and curr.total_assets is not None:
        curr_aq = 1 - safe_div(float(curr.current_assets) + float(curr.ppe), curr.total_assets)
    else:
        curr_aq = None
        
    if prev.current_assets is not None and prev.ppe is not None and prev.total_assets is not None:
        prev_aq = 1 - safe_div(float(prev.current_assets) + float(prev.ppe), prev.total_assets)
    else:
        prev_aq = None
        
    results['aqi'] = safe_div(curr_aq, prev_aq)

    # 4. SGI (Sales Growth Index)
    results['sgi'] = safe_div(curr.net_sales, prev.net_sales)

    # 5. DEPI (Depreciation Index)
    if prev.depreciation is not None and prev.ppe is not None:
        prev_dep = safe_div(prev.depreciation, float(prev.ppe) + float(prev.depreciation))
    else:
        prev_dep = None
        
    if curr.depreciation is not None and curr.ppe is not None:
        curr_dep = safe_div(curr.depreciation, float(curr.ppe) + float(curr.depreciation))
    else:
        curr_dep = None
        
    results['depi'] = safe_div(prev_dep, curr_dep)

    # 6. SGAI (Sales, General and Administrative expenses Index)
    curr_sga = safe_div(curr.sga_expense, curr.net_sales)
    prev_sga = safe_div(prev.sga_expense, prev.net_sales)
    results['sgai'] = safe_div(curr_sga, prev_sga)

    # 7. LVGI (Leverage Index)
    curr_lv = safe_div(curr.total_liabilities, curr.total_assets)
    prev_lv = safe_div(prev.total_liabilities, prev.total_assets)
    results['lvgi'] = safe_div(curr_lv, prev_lv)

    # 8. TATA (Total Accruals to Total Assets)
    if curr.income_continuing_operations is not None and curr.cfo is not None and curr.total_assets is not None:
        results['tata'] = safe_div(float(curr.income_continuing_operations) - float(curr.cfo), curr.total_assets)

    # Final M-Score calculation
    # Only calculate if ALL 8 indicators are present
    if all(v is not None for k, v in results.items() if k not in ['m_score', 'is_manipulator']):
        score = -4.84 + (0.920 * results['dsri']) + (0.528 * results['gmi']) + \
                (0.404 * results['aqi']) + (0.892 * results['sgi']) + \
                (0.115 * results['depi']) - (0.172 * results['sgai']) + \
                (4.679 * results['tata']) - (0.327 * results['lvgi'])
        
        results['m_score'] = round(score, 4)
        results['is_manipulator'] = score > -1.78
        
    # Round all other float outputs to 4 decimals for cleanliness
    for k, v in results.items():
        if v is not None and type(v) == float:
            results[k] = round(v, 4)

    return results
