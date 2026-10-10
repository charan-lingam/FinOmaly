import * as React from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, ShieldAlert, Zap, FileSearch } from "lucide-react"

import { Button } from "./button"
import { Card, CardContent } from "./card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs"
import { BorderBeam } from "./border-beam"

export function Hero195() {
  const navigate = useNavigate()

  return (
    <section className="relative w-full overflow-hidden bg-background py-16 md:py-24">
      <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-8">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
            FinOmaly Core Engine 2.0
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground">
            Detect Financial <span className="text-blue-500">Anomalies</span> in Seconds
          </h1>
          <p className="text-lg text-muted-foreground max-w-[600px] mx-auto">
            Protect your investments using our advanced Beneish M-Score engine. FinOmaly analyzes corporate statements and instantly flags hidden manipulation risks.
          </p>
        </div>

        <div className="flex gap-4">
          <Button size="lg" onClick={() => navigate('/analysis/new')} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
            Start New Analysis <ArrowRight size={16} />
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/companies')}>
            View Companies
          </Button>
        </div>

        {/* Dashboard Preview with Tabs & BorderBeam */}
        <div className="w-full max-w-4xl mt-12 relative">
          <Tabs defaultValue="analysis" className="w-full flex flex-col items-center">
            <TabsList className="mb-6">
              <TabsTrigger value="analysis" className="gap-2"><FileSearch size={14} /> Data Analysis</TabsTrigger>
              <TabsTrigger value="beneish" className="gap-2"><Zap size={14} /> Beneish M-Score</TabsTrigger>
              <TabsTrigger value="security" className="gap-2"><ShieldAlert size={14} /> Secure Workspaces</TabsTrigger>
            </TabsList>
            
            <TabsContent value="analysis" className="w-full">
              <Card className="relative w-full overflow-hidden border-0 bg-muted/20 shadow-2xl">
                <BorderBeam size={400} duration={12} delay={9} colorFrom="#3b82f6" colorTo="#8b5cf6" />
                <CardContent className="p-8 sm:p-12 text-left min-h-[300px] flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4">Instant processing algorithms</h3>
                  <p className="text-muted-foreground text-lg mb-6 max-w-lg">
                    Automatically parse complex CSV statements into structured financial metrics in real time with high data integrity.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {[32, 49, 37, 60, 48, 72, 62, 88].map((height, i) => (
                      <div key={i} className="h-24 bg-muted rounded flex items-end overflow-hidden">
                        <div className="w-full bg-blue-500/80 rounded-t" style={{ height: `${height}%` }}></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="beneish" className="w-full">
              <Card className="relative w-full overflow-hidden border-0 bg-muted/20 shadow-2xl">
                <BorderBeam size={400} duration={12} delay={9} colorFrom="#f59e0b" colorTo="#ef4444" />
                <CardContent className="p-8 sm:p-12 text-left min-h-[300px] flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4">Predictive Fraud Detection</h3>
                  <p className="text-muted-foreground text-lg mb-6 max-w-lg">
                    An 8-variable predictive model that detects earnings manipulation and flags potential fraud before it damages your portfolio.
                  </p>
                  <div className="flex gap-4">
                    <div className="h-32 w-32 rounded-full border-[12px] border-red-500/20 border-t-red-500 flex items-center justify-center">
                      <span className="text-2xl font-bold text-red-500">89%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="w-full">
              <Card className="relative w-full overflow-hidden border-0 bg-muted/20 shadow-2xl">
                <BorderBeam size={400} duration={12} delay={9} colorFrom="#10b981" colorTo="#3b82f6" />
                <CardContent className="p-8 sm:p-12 text-left min-h-[300px] flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4">Enterprise-Grade Workspaces</h3>
                  <p className="text-muted-foreground text-lg mb-6 max-w-lg">
                    Total data isolation and encryption. Your financial models and targets remain entirely private.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div className="p-4 bg-background rounded border">End-to-end Encryption</div>
                     <div className="p-4 bg-background rounded border">Isolated DBs</div>
                     <div className="p-4 bg-background rounded border">Strict Access Control</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

