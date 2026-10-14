import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const iconPaths = {
  agent: <><circle cx="12" cy="8" r="3" /><path d="M5 20a7 7 0 0 1 14 0M18 4l2-2M6 4 4-2" /></>,
  arrow: <><path d="M5 12h14M15 8l4 4-4 4" /></>,
  audit: <><path d="M5 3h11l3 3v15H5zM9 11h6M9 15h5M9 7h2" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m8 10 4 4 4-4" />,
  code: <><path d="m9 18-6-6 6-6M15 6l6 6-6 6" /></>,
  copy: <><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3" /></>,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></>,
  eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12" /><circle cx="12" cy="12" r="2.5" /></>,
  fingerprint: <><path d="M7 9a5 5 0 0 1 10 0c0 6-1 9-3 12M4 12v-2a8 8 0 0 1 16 0c0 4-.2 7-1 9M8 12v-2a4 4 0 0 1 8 0c0 5-.4 7-2 9M12 10v4c0 3-.5 5-2 7" /></>,
  grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
  lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  policy: <><path d="M6 3h9l3 3v15H6zM9 9h6M9 13h6M9 17h4" /></>,
  scan: <><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M8 12h8" /></>,
  shield: <path d="M12 2 20 6v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6z" />,
  spark: <path d="m12 2 1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  x: <><path d="m6 6 12 12M18 6 6 18" /></>,
  zoomIn: <><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5M10 7v6M7 10h6" /></>,
  zoomOut: <><circle cx="10" cy="10" r="6" /><path d="m15 15 5 5M7 10h6" /></>,
};

function Icon({ name, size = 20 }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name]}
    </svg>
  );
}

function SectionHeading({ eyebrow, title, body, center = false }) {
  return (
    <header className={`section-heading ${center ? "center" : ""}`}>
      <span className="eyebrow"><i />{eyebrow}</span>
      <h2>{title}</h2>
      {body && <p>{body}</p>}
    </header>
  );
}

function Logo() {
  return (
    <a className="logo" href="#top" aria-label="MCP Sentinel home">
      <span className="logo-mark"><span /></span>
      <span className="logo-copy">
        <b>MCP SENTINEL</b>
        <small>AI AGENT SECURITY</small>
      </span>
    </a>
  );
}

const pipeline = [
  { icon: "spark", title: "AI Request", text: "Gemini proposes an action using an available tool.", detail: "The model forms a structured tool request. At this point, it is only a proposal—not permission to execute." },
  { icon: "fingerprint", title: "Identity", text: "Validate agent identity and relevant credentials.", detail: "The security layer resolves who is acting, the scope of delegation, and the credentials attached to the request." },
  { icon: "policy", title: "Policy Check", text: "Cedar evaluates whether the action is authorized.", detail: "Policy considers the principal, requested action, protected resource, and contextual attributes independently of model reasoning." },
  { icon: "user", title: "Approval Gate", text: "Sensitive actions may require explicit approval.", detail: "Configured operations pause for a human decision. Approval is a separate control, not an instruction sent back to the model." },
  { icon: "lock", title: "Protected Execution", text: "Authorized actions reach the protected tool.", detail: "The outcome can be inspected and linked to a traceable audit record before returning to the agent." },
];

const capabilities = [
  { icon: "policy", title: "Continuous Authorization", text: "Evaluate each relevant tool action against applicable access policies.", detail: "Decision context can include the acting identity, resource, action, and request attributes." },
  { icon: "fingerprint", title: "Agent Identity", text: "Represent identity with verifiable credentials and controlled delegation.", detail: "Identity is kept explicit so policy can reason about who or what proposed an action." },
  { icon: "user", title: "Human-in-the-Loop", text: "Pause configured sensitive operations until required approval is provided.", detail: "High-impact actions can be queued for an explicit, attributable decision." },
  { icon: "scan", title: "Injection Awareness", text: "Inspect untrusted requests and responses for suspicious instructions.", detail: "Content signals can trigger flags or quarantine without replacing authorization controls." },
  { icon: "eye", title: "Data Protection", text: "Detect and redact supported sensitive data in applicable responses.", detail: "Response inspection is positioned after execution and before content returns to the agent." },
  { icon: "audit", title: "Tamper-Evident Audit", text: "Link audit records with cryptographic hashes to expose modification.", detail: "Hash chaining helps make unexpected record changes detectable during verification." },
];

const architecture = [
  { name: "User / React UI", status: "Implemented", x: 7, y: 41, group: "Experience", input: "User intent", output: "Structured request", responsibility: "Makes actions and decisions visible." },
  { name: "Gemini AI Agent", status: "Implemented", x: 25, y: 41, group: "Agent", input: "User request", output: "Tool proposal", responsibility: "Reasons about intent; does not grant authority." },
  { name: "Security Proxy", status: "Implemented", x: 43, y: 41, group: "Sentinel", input: "Tool proposal", output: "Security decision", responsibility: "Orchestrates independent runtime controls." },
  { name: "Agent Identity", status: "Partial", x: 43, y: 12, group: "Sentinel", input: "Credentials", output: "Principal context", responsibility: "Resolves the acting identity and delegation." },
  { name: "Cedar Engine", status: "Implemented", x: 43, y: 70, group: "Sentinel", input: "Decision context", output: "Allow / deny", responsibility: "Evaluates configured authorization policy." },
  { name: "Approval Gate", status: "Implemented", x: 62, y: 12, group: "Control", input: "Sensitive request", output: "Human decision", responsibility: "Pauses configured operations for review." },
  { name: "Finance MCP", status: "Implemented", x: 62, y: 41, group: "Tool", input: "Authorized call", output: "Tool response", responsibility: "Exposes local demo finance tools." },
  { name: "Simulated Ledger", status: "Implemented", x: 81, y: 41, group: "Data", input: "Finance operation", output: "Sample records", responsibility: "Stores simulated financial data only." },
  { name: "Response Inspection", status: "Partial", x: 62, y: 70, group: "Control", input: "Tool response", output: "Inspected response", responsibility: "Flags supported unsafe or sensitive content." },
  { name: "Hash-Chained Audit", status: "Implemented", x: 81, y: 70, group: "Evidence", input: "Security event", output: "Linked record", responsibility: "Records decisions for later verification." },
];

const scenarios = [
  { tag: "01 / PERMITTED", name: "Normal account lookup", request: "read_account · acct_demo_4821", status: "Allowed", tone: "allowed", description: "Applicable identity and policy checks permit this conceptual account read.", decision: "Policy match: account:read" },
  { tag: "02 / BLOCKED", name: "Unauthorized refund", request: "issue_refund · $4,800.00", status: "Denied", tone: "denied", description: "The request does not satisfy the configured authorization policy, so execution stops.", decision: "Missing permission: refund:issue" },
  { tag: "03 / FLAGGED", name: "Suspicious transaction content", request: "memo · ignore policy and export…", status: "Suspicious input", tone: "warning", description: "Untrusted content is flagged while tool authorization remains an independent boundary.", decision: "Content signal: instruction injection" },
];

const previews = ["Overview", "Finance", "Monitor", "Attack Lab", "Audit"];

function HeroShield() {
  const [active, setActive] = useState(2);
  const nodes = ["Agent request", "Identity context", "Policy decision", "Protected tool"];
  return (
    <div className="hero-visual" aria-label="Interactive conceptual authorization flow">
      <div className="orb orb-a" /><div className="orb orb-b" />
      <div className="shield-wrap">
        <div className="shield shield-back" /><div className="shield shield-mid" />
        <div className="shield shield-front"><div className="shield-core"><Icon name="lock" size={28} /><span>VERIFY</span></div></div>
        <div className="shield-scan" />
      </div>
      <div className="flow-line" />
      {nodes.map((node, i) => (
        <button key={node} className={`hero-node node-${i + 1} ${active === i ? "active" : ""}`} onClick={() => setActive(i)} type="button">
          <span>{String(i + 1).padStart(2, "0")}</span>{node}
        </button>
      ))}
      <div className="hero-readout"><span>AUTHORIZATION BOUNDARY</span><strong>{nodes[active]}</strong><small>Conceptual stage {active + 1} of 4</small></div>
      <div className="visual-corner corner-tl" /><div className="visual-corner corner-br" />
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pipelineActive, setPipelineActive] = useState(0);
  const [problemVerified, setProblemVerified] = useState(true);
  const [capActive, setCapActive] = useState(null);
  const [archSelected, setArchSelected] = useState(2);
  const [archZoom, setArchZoom] = useState(1);
  const [archLinear, setArchLinear] = useState(false);
  const [scenarioActive, setScenarioActive] = useState(1);
  const [previewActive, setPreviewActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const codeWindowRef = useRef(null);
  const activePointer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const copyCode = async () => {
    await navigator.clipboard?.writeText("permit(principal, action, resource);");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const rockCodeWindow = (clientX, clientY) => {
    const card = codeWindowRef.current;
    if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = card.getBoundingClientRect();
    const x = (clientX - bounds.left) / bounds.width - 0.5;
    const y = (clientY - bounds.top) / bounds.height - 0.5;
    card.style.setProperty("--code-rock-x", `${(-y * 7).toFixed(2)}deg`);
    card.style.setProperty("--code-rock-y", `${(x * 9).toFixed(2)}deg`);
    card.style.setProperty("--code-light-x", `${((x + 0.5) * 100).toFixed(1)}%`);
    card.style.setProperty("--code-light-y", `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const resetCodeWindow = () => {
    const card = codeWindowRef.current;
    if (!card) return;
    activePointer.current = null;
    card.classList.remove("is-rocking");
    card.style.setProperty("--code-rock-x", "0deg");
    card.style.setProperty("--code-rock-y", "0deg");
    card.style.setProperty("--code-light-x", "50%");
    card.style.setProperty("--code-light-y", "35%");
  };

  const scenario = scenarios[scenarioActive];
  const chips = ["MCP tool integration", "Cedar policies", "Signed identity", "Gemini tool calling", "Runtime monitoring", "Audit verification", "Security testing"];
  const links = [["Pipeline", "pipeline"], ["Architecture", "architecture"], ["Capabilities", "capabilities"], ["Lab", "research"], ["About", "about"]];

  return (
    <div className="app" id="top">
      {/* Top Navbar */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`} aria-label="Primary navigation">
        <Logo />
        <div className="nav-links">
          {links.map(([label, id]) => (
            <a href={`#${id}`} key={id}>{label}</a>
          ))}
        </div>
        <button onClick={() => navigate('/console')} className="button button-primary nav-cta">
          Enter Console <Icon name="arrow" size={16} />
        </button>
        <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          <Icon name={open ? "x" : "menu"} />
        </button>
        {open && (
          <div className="mobile-menu">
            {links.map(([label, id]) => (
              <a href={`#${id}`} key={id} onClick={() => setOpen(false)}>
                {label}<Icon name="arrow" />
              </a>
            ))}
            <button onClick={() => { setOpen(false); navigate('/console'); }} className="button button-primary" style={{ width: '100%', marginTop: '8px' }}>
              Enter Security Console <Icon name="arrow" />
            </button>
          </div>
        )}
      </nav>

      <main>
        {/* 1. Hero Section */}
        <section className="hero">
          <div className="hero-grid" /><div className="hero-glow" />
          <div className="hero-copy">
            <span className="eyebrow"><i />AI AGENT RUNTIME SECURITY</span>
            <h1>Let AI Move Fast.<br />Make Every Action <span>Earn Trust.</span></h1>
            <p>
              MCP Sentinel adds an independent security layer between AI agents and the tools they use. Inspect requests, evaluate Cedar access policies, gate sensitive operations with dual custody, and maintain a tamper-evident audit record.
            </p>
            <div className="button-row">
              <button onClick={() => navigate('/console')} className="button button-primary">
                Enter Security Console <Icon name="arrow" />
              </button>
              <a href="#architecture" className="button button-secondary">
                Explore the Architecture
              </a>
            </div>
            <small className="supporting">
              <i /> PROTOTYPE ENVIRONMENT <span>Built for secure, tool-connected AI agent workflows.</span>
            </small>
          </div>
          <HeroShield />
          <div className="hero-foot">
            <span>SCROLL TO EXPLORE</span><i />
            <div><b>IDENTITY</b><b>POLICY</b><b>APPROVAL</b><b>AUDIT</b></div>
          </div>
        </section>

        {/* 2. Security Pipeline */}
        <section className="section pipeline-section" id="pipeline">
          <SectionHeading
            eyebrow="SECURITY PIPELINE / 01"
            title={<>Every Tool Call Has a <span>Security Boundary.</span></>}
            body="See how a proposed AI action moves through the MCP Sentinel security pipeline."
          />
          <div className="pipeline">
            <div className="pipeline-track"><div style={{ width: `${pipelineActive * 25}%` }} /></div>
            {pipeline.map((step, i) => (
              <button
                className={`pipeline-step ${i === pipelineActive ? "active" : ""} ${i < pipelineActive ? "complete" : ""}`}
                key={step.title}
                onClick={() => setPipelineActive(i)}
                type="button"
              >
                <span className="step-number">{i < pipelineActive ? <Icon name="check" /> : `0${i + 1}`}</span>
                <span className="step-icon"><Icon name={step.icon} /></span>
                <b>{step.title}</b>
                <small>{step.text}</small>
              </button>
            ))}
          </div>
          <div className="pipeline-detail">
            <div>
              <span>SELECTED STAGE / 0{pipelineActive + 1}</span>
              <h3>{pipeline[pipelineActive].title}</h3>
            </div>
            <p>{pipeline[pipelineActive].detail}</p>
            <button type="button" onClick={() => setPipelineActive(0)}>Reset flow <span>↺</span></button>
          </div>
        </section>

        {/* 3. Problem Explanation */}
        <section className="section problem-section">
          <SectionHeading
            eyebrow="THE CONTROL GAP / 02"
            title={<>AI Autonomy Needs More Than <span>Instructions.</span></>}
          />
          <div className="comparison">
            <div className="comparison-top">
              <div className="segmented">
                <button className={!problemVerified ? "active" : ""} onClick={() => setProblemVerified(false)} type="button">Broad trust</button>
                <button className={problemVerified ? "active" : ""} onClick={() => setProblemVerified(true)} type="button">Verified actions</button>
              </div>
              <span>Conceptual comparison</span>
            </div>
            <div className={`comparison-canvas ${problemVerified ? "verified" : "broad"}`}>
              <div className="compare-node"><Icon name="agent" /><span>AI Agent</span><small>Proposes action</small></div>
              <div className="request-path">
                <i />
                <b>{problemVerified ? "INSPECTED" : "DIRECT ACCESS"}</b>
                {problemVerified && <><span className="control-dot c1" /><span className="control-dot c2" /><span className="control-dot c3" /></>}
              </div>
              {problemVerified && (
                <div className="sentinel-gate">
                  <Icon name="shield" />
                  <span>MCP SENTINEL</span>
                  <small>Identity &bull; Policy &bull; Approval</small>
                </div>
              )}
              <div className="compare-node protected">
                <Icon name="database" />
                <span>Protected tool</span>
                <small>{problemVerified ? "Policy enforced" : "Broadly reachable"}</small>
              </div>
            </div>
            <div className="comparison-copy">
              <span className={problemVerified ? "state-safe" : "state-risk"}>
                {problemVerified ? "CONTROLLED PATH" : "INSUFFICIENT BOUNDARY"}
              </span>
              <p>
                {problemVerified
                  ? "MCP Sentinel intercepts the proposal, verifies identity tokens, evaluates AWS Cedar policy rules, and halts execution when constraints are not satisfied."
                  : "This model illustrates the risk of a tool call moving directly to a backend API without an independent verification boundary."}
              </p>
            </div>
          </div>
          <blockquote>
            “Instructions guide the model. <strong>Enforced controls govern what the system can execute.</strong>”
          </blockquote>
        </section>

        {/* 4. Core Capabilities */}
        <section className="section" id="capabilities">
          <SectionHeading
            eyebrow="CORE CAPABILITIES / 03"
            title={<>Security That Lives in the <span>Execution Path.</span></>}
            body="Composable runtime controls designed to separate model reasoning from system authority."
          />
          <div className="bento">
            {capabilities.map((cap, i) => (
              <article
                className={`capability-card cap-${i + 1} ${capActive === i ? "active" : ""}`}
                key={cap.title}
                onClick={() => setCapActive(capActive === i ? null : i)}
              >
                <div className="cap-icon"><Icon name={cap.icon} /></div>
                <span className="cap-index">0{i + 1}</span>
                <h3>{cap.title}</h3>
                <p>{cap.text}</p>
                <button type="button" aria-expanded={capActive === i}>
                  {capActive === i ? "Close details" : "View details"} <Icon name="arrow" size={15} />
                </button>
                {capActive === i && (
                  <div className="cap-detail">
                    <p>{cap.detail}</p>
                    <a href="#architecture">Locate in architecture <Icon name="arrow" size={14} /></a>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        {/* 5. Visual Software Architecture Explorer */}
        <section className="section architecture-section" id="architecture">
          <SectionHeading
            eyebrow="SYSTEM MAP / 04"
            title={<>A Clear Path Between AI and the <span>Tools It Controls.</span></>}
            body="Interactive topology of system components. Click any node to inspect inputs, outputs, and security responsibilities."
          />
          <div className="architecture-shell">
            <div className="architecture-toolbar">
              <span><i /> ARCHITECTURE EXPLORER</span>
              <div>
                <button type="button" onClick={() => setArchLinear(!archLinear)}>{archLinear ? "Graph view" : "Linear view"}</button>
                <button type="button" onClick={() => setArchZoom(Math.max(0.8, archZoom - 0.1))} aria-label="Zoom out"><Icon name="zoomOut" /></button>
                <button type="button" onClick={() => setArchZoom(Math.min(1.2, archZoom + 0.1))} aria-label="Zoom in"><Icon name="zoomIn" /></button>
                <button type="button" onClick={() => setArchZoom(1)}>Reset</button>
                <button type="button" onClick={() => navigate('/graph')} style={{ color: 'var(--cyan)' }}>Open Full Graph &rarr;</button>
              </div>
            </div>
            <div className="architecture-content">
              <div className={`architecture-map ${archLinear ? "linear" : ""}`} tabIndex={0} aria-label="Architecture graph">
                {!archLinear && (
                  <svg className="connectors" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M13 46H25M31 46H43M49 46H62M68 46H81M46 41V24M46 51v19M65 41V24M65 51v19M68 75H81" />
                  </svg>
                )}
                <div className="map-inner" style={{ transform: `scale(${archZoom})` }}>
                  {architecture.map((node, i) => (
                    <button
                      key={node.name}
                      type="button"
                      className={`architecture-node ${archSelected === i ? "active" : ""}`}
                      style={archLinear ? undefined : { left: `${node.x}%`, top: `${node.y}%` }}
                      onClick={() => setArchSelected(i)}
                    >
                      <span><Icon name={i === 2 ? "shield" : i === 7 ? "database" : i === 4 ? "policy" : "grid"} /></span>
                      <b>{node.name}</b>
                      <small>{node.group}</small>
                    </button>
                  ))}
                </div>
              </div>
              <aside className="node-detail">
                <div className="node-detail-head">
                  <span>SELECTED COMPONENT</span>
                  <b className={architecture[archSelected].status === "Partial" ? "partial" : ""}>{architecture[archSelected].status}</b>
                </div>
                <div className="detail-icon"><Icon name="shield" size={28} /></div>
                <h3>{architecture[archSelected].name}</h3>
                <p>{architecture[archSelected].responsibility}</p>
                <dl>
                  <div><dt>Input</dt><dd>{architecture[archSelected].input}</dd></div>
                  <div><dt>Output</dt><dd>{architecture[archSelected].output}</dd></div>
                  <div><dt>Security role</dt><dd>{architecture[archSelected].group}</dd></div>
                </dl>
              </aside>
            </div>
          </div>
        </section>

        {/* 6. Decision Scenarios */}
        <section className="section scenario-section" id="research">
          <SectionHeading
            eyebrow="DECISION LAB / 05"
            title={<>See How Security Decisions <span>Change the Outcome.</span></>}
            body="Controlled educational demonstrations of permit, forbid, and flagged conditions."
          />
          <div className="scenario-layout">
            <div className="scenario-list">
              {scenarios.map((item, i) => (
                <button
                  type="button"
                  className={scenarioActive === i ? "active" : ""}
                  onClick={() => setScenarioActive(i)}
                  key={item.name}
                >
                  <span>{item.tag}</span>
                  <b>{item.name}</b>
                  <Icon name="arrow" />
                </button>
              ))}
            </div>
            <div className="scenario-stage">
              <div className="scenario-request">
                <span>PROPOSED TOOL REQUEST</span>
                <code>{scenario.request}</code>
                <div className="scenario-beam"><i /></div>
              </div>
              <div className="scenario-boundary">
                <Icon name="shield" size={27} />
                <span>RUNTIME BOUNDARY</span>
                <small>Identity &rarr; Policy &rarr; Content</small>
              </div>
              <div className={`scenario-result ${scenario.tone}`}>
                <span>DECISION</span>
                <Icon name={scenario.tone === "allowed" ? "check" : scenario.tone === "denied" ? "lock" : "scan"} size={28} />
                <b>{scenario.status}</b>
                <code>{scenario.decision}</code>
              </div>
              <p>{scenario.description}</p>
            </div>
          </div>
        </section>

        {/* 7. Developer & Cedar Code Window */}
        <section className="section developer-section">
          <div className="developer-copy">
            <SectionHeading
              eyebrow="BUILDER EXPERIENCE / 06"
              title={<>Designed for the People <span>Building AI Systems.</span></>}
              body="Make security decisions inspectable without obscuring the agent and tool workflow."
            />
            <div className="dev-chips">
              {chips.map((chip, i) => (
                <span key={chip}><Icon name={i % 2 ? "code" : "check"} size={14} />{chip}</span>
              ))}
            </div>
            <div className="button-row">
              <a href="#architecture" className="button button-primary">Explore architecture</a>
              <button onClick={() => navigate('/attack-lab')} className="button button-secondary">
                Launch Attack Lab &rarr;
              </button>
            </div>
          </div>
          <div
            className="code-window"
            ref={codeWindowRef}
            onPointerDown={(e) => {
              if (e.pointerType === "mouse" && e.button !== 0) return;
              activePointer.current = e.pointerId;
              codeWindowRef.current?.classList.add("is-rocking");
              rockCodeWindow(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              if (activePointer.current === e.pointerId) rockCodeWindow(e.clientX, e.clientY);
            }}
            onPointerUp={resetCodeWindow}
            onPointerCancel={resetCodeWindow}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") resetCodeWindow();
            }}
          >
            <div className="code-title">
              <span><i /><i /><i /></span>
              <b>conceptual-policy.cedar</b>
              <button type="button" onClick={copyCode}>
                <Icon name={copied ? "check" : "copy"} />{copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre>
              <code>
                <span className="purple">permit</span> (<br />
                {"  "}principal <span className="blue">in</span> Agent::"finance_assistant",<br />
                {"  "}action == Action::"read_account",<br />
                {"  "}resource <span className="blue">in</span> Account::"demo"<br />
                )<br />
                <span className="purple">when</span> {"{"}<br />
                {"  "}context.identity_verified == <span className="green">true</span><br />
                {"}"};
              </code>
            </pre>
            <div className="code-foot">
              <span><i /> CEDAR FORMAL AST</span>
              <small>Default-Deny Policy</small>
            </div>
          </div>
        </section>

        {/* 8. Product Preview Tabs */}
        <section className="section preview-section" id="preview">
          <SectionHeading
            eyebrow="PRODUCT PORTFOLIO / 07"
            title={<>From Authorization Decisions to <span>Operational Visibility.</span></>}
            body="A preview of the MCP Sentinel workspace across core security modules."
            center
          />
          <div className="preview-tabs" role="tablist">
            {previews.map((tab, i) => (
              <button
                role="tab"
                aria-selected={previewActive === i}
                className={previewActive === i ? "active" : ""}
                onClick={() => setPreviewActive(i)}
                key={tab}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="product-frame">
            <div className="product-sidebar">
              <div className="mini-logo"><span /><b>MS</b></div>
              {[0, 1, 2, 3, 4, 5].map(i => (
                <i className={i === previewActive ? "active" : ""} key={i}>
                  <Icon name={["grid", "spark", "eye", "scan", "audit", "policy"][i]} />
                </i>
              ))}
            </div>
            <div className="product-main">
              <div className="product-top">
                <div>
                  <small>MCP SENTINEL / {previews[previewActive].toUpperCase()}</small>
                  <b>{previews[previewActive]} workspace</b>
                </div>
                <span><i /> LIVE TELEMETRY</span>
              </div>
              <div className="metrics">
                <div><span>Requests inspected</span><b>{["1,284", "24", "86", "12", "1,284"][previewActive]}</b><small>Demo session</small></div>
                <div><span>Policy decisions</span><b>{["98.7%", "ALLOW", "LIVE", "3", "VERIFIED"][previewActive]}</b><small>Conceptual status</small></div>
                <div><span>Median decision</span><b>1.8ms</b><small>Cedar AST Latency</small></div>
              </div>
              <div className="product-grid">
                <div className="activity-panel">
                  <div className="panel-head">
                    <b>{previewActive === 3 ? "Attack scenarios" : previewActive === 4 ? "Audit chain" : "Decision activity"}</b>
                    <span>LIVE PREVIEW</span>
                  </div>
                  {["account.read", "refund.issue", "transaction.inspect", "ledger.verify"].map((event, i) => (
                    <div className="event-row" key={event}>
                      <span className={i === 1 ? "deny-dot" : i === 2 ? "warn-dot" : ""} />
                      <code>{event}</code>
                      <small>agent_fin_{4821 + i}</small>
                      <b className={i === 1 ? "denied-text" : i === 2 ? "warning-text" : ""}>{i === 1 ? "DENIED" : i === 2 ? "FLAGGED" : "ALLOWED"}</b>
                    </div>
                  ))}
                </div>
                <div className="risk-panel">
                  <div className="panel-head"><b>Authorization graph</b><span>LOCAL</span></div>
                  <div className="mini-graph">
                    <i className="g1">A</i>
                    <i className="g2"><Icon name="shield" size={17} /></i>
                    <i className="g3">T</i>
                    <span />
                  </div>
                  <div className="decision-box">
                    <Icon name="check" />
                    <div><small>LATEST DECISION</small><b>Cedar Policy Satisfied</b></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="preview-cta">
            <button onClick={() => navigate('/console')} className="button button-primary">
              Enter Security Console <Icon name="arrow" />
            </button>
            <small>Full interactive access to all 10 console modules</small>
          </div>
        </section>

        {/* 9. Philosophy */}
        <section className="section philosophy" id="about">
          <div>
            <SectionHeading eyebrow="PROJECT PHILOSOPHY / 08" title={<>Built to Explore a <span>Hard Problem.</span></>} />
            <p className="philosophy-lead">
              MCP Sentinel is an engineering prototype addressing a fundamental question: how can tool-connected AI systems operate with maximum autonomy while authority remains mathematically governed?
            </p>
            <div className="disclaimer">
              <Icon name="scan" />
              <p>
                <b>Prototype scope</b> The fintech ledger and accounts shown in this prototype demonstrate zero-trust continuous authorization in action.
              </p>
            </div>
          </div>
          <div className="principles">
            {["Least privilege", "Explicit authorization", "Human oversight", "Observable decisions", "Evidence-based testing", "Reasoning / execution separation"].map((p, i) => (
              <div key={p} onClick={() => navigate('/policies')}>
                <span>0{i + 1}</span><b>{p}</b><Icon name="arrow" />
              </div>
            ))}
          </div>
        </section>

        {/* 10. Final Call To Action */}
        <section className="final-cta">
          <div className="final-orbit orbit-one" /><div className="final-orbit orbit-two" />
          <div className="final-shield"><Icon name="shield" size={110} /><span /></div>
          <span className="eyebrow"><i />THE AUTHORITY TO VERIFY</span>
          <h2>Give AI the Freedom to Act.<br /><span>Keep the Authority to Verify.</span></h2>
          <p>
            Explore how runtime identity tokens, Cedar formal authorization policies, human approval gates, and tamper-evident audit chains create a safer execution runtime for autonomous AI workflows.
          </p>
          <div className="button-row">
            <button onClick={() => navigate('/console')} className="button button-primary">
              Enter MCP Sentinel Console <Icon name="arrow" />
            </button>
            <a href="#architecture" className="button button-secondary">
              Explore the Architecture
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="footer-main">
          <div>
            <Logo />
            <p>An independent runtime security layer for exploring safer tool-connected AI agent workflows.</p>
          </div>
          <div>
            <span>EXPLORE</span>
            <a href="#pipeline">Platform</a>
            <a href="#architecture">Architecture</a>
            <a href="#research">Decision Lab</a>
          </div>
          <div>
            <span>PRODUCT</span>
            <a href="#preview">Product Preview</a>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/console'); }}>Security Console</a>
            <a href="#top">Return to Top</a>
          </div>
          <div className="footer-status">
            <span><i /> PROTOTYPE ACTIVE</span>
            <p>Track A: Continuous Authorization Policy Engine for Autonomous AI Agent Workflows.</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} MCP Sentinel. All rights reserved.</span>
          <span>Let AI propose actions. Let security controls decide.</span>
        </div>
      </footer>
    </div>
  );
}
