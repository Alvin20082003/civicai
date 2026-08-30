import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, Shield, FileText, UserCheck, CheckCircle2, AlertCircle, ChevronDown, ChevronRight, Lightbulb } from 'lucide-react';
import { chatResponses, trustBadges } from '@/lib/mockData';
import TrustBadges from '@/components/TrustBadges';

const suggestedQueries = [
  'Am I eligible for the merit scholarship?',
  'What government services can I apply for?',
  'Check my GST voucher status',
  'Am I eligible for HDB housing grant?',
];

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text) => {
    const query = text || input;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const matched = chatResponses.find(c => c.query.toLowerCase() === query.toLowerCase());
      const response = matched || {
        response: {
          recommendation: 'Information Available',
          confidence: 88,
          explanation: 'Based on your verified citizen profile and the current government policy database, I can provide guidance on this query. The recommendation below is generated through our Rule Engine and Explainable AI pipeline, grounded in verified government policy sources.',
          factors: [
            { label: 'Profile Verified', status: 'pass', detail: 'Identity and residency confirmed' },
            { label: 'Policy Matched', status: 'pass', detail: 'Relevant policy sections retrieved via RAG' },
            { label: 'Rule Engine Validated', status: 'pass', detail: 'Eligibility rules evaluated successfully' },
          ],
          policySource: 'Government Digital Services Policy',
          policyDepartment: 'GovTech Singapore',
          policyVersion: 'v1.9.0',
          policyLastUpdated: '2026-07-01',
          humanReviewAvailable: true,
          alternatives: [
            { title: 'Contact Government Hotline', match: 75, reason: 'Speak to an officer for detailed guidance' },
          ],
        },
      };
      setMessages(prev => [...prev, { role: 'assistant', content: response.response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="border-b border-border bg-white/80 backdrop-blur-xl px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-heading font-semibold text-base">CivicAI Assistant</h1>
            <p className="text-xs text-civic-teal font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-civic-teal animate-pulse-soft" />
              Explainable AI · Government Source Verified
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Welcome message */}
          {messages.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="glass-card rounded-2xl p-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-bg mx-auto mb-4">
                  <Brain className="h-7 w-7 text-white" />
                </div>
                <h2 className="font-heading text-lg font-semibold mb-2">How can I help you today?</h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Ask about government services, eligibility, applications, or policies. Every response is explainable and based on verified government sources.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  {suggestedQueries.map((q) => (
                    <button key={q} onClick={() => handleSend(q)} className="px-4 py-2 rounded-xl bg-white border border-border text-xs font-medium hover:border-civic-blue/30 hover:bg-civic-blue/5 transition-all">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {msg.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-[80%] gradient-bg text-white rounded-2xl rounded-tr-sm px-4 py-3">
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ) : (
                <AIResponse data={msg.content} />
              )}
            </motion.div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div className="flex gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm bg-muted/60 border border-border">
                {[0, 1, 2].map(i => (
                  <span key={i} className="h-2 w-2 rounded-full bg-civic-blue/40 animate-pulse-soft" style={{ animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-white/80 backdrop-blur-xl p-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about government services, eligibility, or policies..."
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-white text-sm outline-none focus:border-civic-blue/40 focus:ring-2 focus:ring-civic-blue/10 transition-all"
          />
          <button onClick={() => handleSend()} className="gradient-bg text-white p-3 rounded-xl hover:opacity-90 transition-opacity">
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AIResponse({ data }) {
  const [showFactors, setShowFactors] = useState(true);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const isEligible = data.recommendation === 'Eligible' || data.recommendation === 'Approved';

  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg shrink-0">
        <Brain className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 space-y-3">
        {/* Recommendation header */}
        <div className="glass-card rounded-2xl rounded-tl-sm p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-1">Recommendation</p>
              <div className="flex items-center gap-2.5">
                <span className={`text-xl font-bold ${isEligible ? 'text-green-600' : 'text-civic-blue'}`}>{data.recommendation}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isEligible ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-civic-blue/5 text-civic-blue border border-civic-blue/10'}`}>
                  Confidence {data.confidence}%
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-end gap-0.5">
                <span className="text-3xl font-bold gradient-text">{data.confidence}</span>
                <span className="text-sm font-bold text-muted-foreground mb-1">%</span>
              </div>
              <p className="text-[9px] text-muted-foreground">Confidence Score</p>
            </div>
          </div>

          {/* Explanation */}
          <div className="mb-4">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-1.5">Reason</p>
            <p className="text-sm text-foreground leading-relaxed">{data.explanation}</p>
          </div>

          {/* Factors */}
          <div className="mb-4">
            <button onClick={() => setShowFactors(!showFactors)} className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wide hover:text-foreground transition-colors mb-2">
              {showFactors ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              Contributing Factors ({data.factors.length})
            </button>
            <AnimatePresence>
              {showFactors && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="space-y-2">
                    {data.factors.map((factor, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg bg-white/60 border border-border p-3">
                        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${factor.status === 'pass' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                          {factor.status === 'pass' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium">{factor.label}</p>
                          <p className="text-[10px] text-muted-foreground">{factor.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Policy source */}
          <div className="rounded-lg bg-civic-blue/5 border border-civic-blue/10 p-3.5 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-3.5 w-3.5 text-civic-blue" />
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">Government Policy Source</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs font-medium">{data.policySource}</p>
                <p className="text-[10px] text-muted-foreground">{data.policyDepartment}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium">{data.policyVersion}</p>
                <p className="text-[10px] text-muted-foreground">Updated {data.policyLastUpdated}</p>
              </div>
            </div>
          </div>

          {/* Human review */}
          {data.humanReviewAvailable && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <UserCheck className="h-3.5 w-3.5" />
              </div>
              <p className="text-xs text-muted-foreground">Human review available — request an officer to review this recommendation.</p>
            </div>
          )}

          {/* Trust badges */}
          <div className="pt-3 border-t border-border">
            <TrustBadges compact />
          </div>
        </div>

        {/* Alternatives */}
        {data.alternatives && data.alternatives.length > 0 && (
          <div className="glass-card rounded-2xl p-4">
            <button onClick={() => setShowAlternatives(!showAlternatives)} className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-civic-teal" />
                <span className="text-xs font-semibold">Alternative Recommendations</span>
              </div>
              {showAlternatives ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
            </button>
            <AnimatePresence>
              {showAlternatives && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="mt-3 space-y-2">
                    {data.alternatives.map((alt, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-white/60 border border-border p-3">
                        <div>
                          <p className="text-xs font-medium">{alt.title}</p>
                          <p className="text-[10px] text-muted-foreground">{alt.reason}</p>
                        </div>
                        <span className="text-sm font-bold text-civic-teal">{alt.match}%</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}