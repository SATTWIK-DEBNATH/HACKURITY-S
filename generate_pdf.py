import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable, KeepTogether
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

def generate_pdf(output_path: str):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY = colors.HexColor("#07090d")     # Obsidian Deep
    ACCENT_CYAN = colors.HexColor("#0284c7") # Ocean Cyan
    ACCENT_DARK = colors.HexColor("#0f172a")
    TEXT_MAIN = colors.HexColor("#1e293b")
    TEXT_MUTED = colors.HexColor("#475569")
    BG_CARD = colors.HexColor("#f8fafc")
    BORDER_COLOR = colors.HexColor("#cbd5e1")
    TAG_BG = colors.HexColor("#e0f2fe")
    TAG_TEXT = colors.HexColor("#0369a1")

    # Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=PRIMARY,
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=ACCENT_CYAN,
        spaceAfter=12
    )

    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        textColor=TEXT_MUTED,
        spaceAfter=14
    )

    h2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=PRIMARY,
        spaceBefore=12,
        spaceAfter=6
    )

    h3_style = ParagraphStyle(
        'Heading3Custom',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=ACCENT_CYAN,
        spaceBefore=8,
        spaceAfter=4
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=TEXT_MAIN,
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.2,
        leading=11.5,
        textColor=TEXT_MAIN,
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=3
    )

    callout_style = ParagraphStyle(
        'CalloutText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=12,
        textColor=TEXT_MAIN
    )

    code_block_style = ParagraphStyle(
        'CodeBlock',
        parent=styles['Code'],
        fontName='Courier',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor("#0f172a")
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=TEXT_MAIN
    )

    story = []

    # Title & Metadata
    story.append(Paragraph("MCP Sentinel (VeriAuth-ZTA)", title_style))
    story.append(Paragraph("Continuous Zero-Trust Authorization Policy Engine & Runtime Security Sidecar for AI Agents", subtitle_style))
    story.append(Paragraph("<b>Hackurity 2026</b> &bull; Track A: AI + Security Crossover &bull; NIST SP 800-207 Architecture &bull; AWS Cedar v3.2/v4.12 Engine &bull; Obsidian Flow Design", meta_style))
    story.append(HRFlowable(width="100%", thickness=1, color=BORDER_COLOR, spaceAfter=12))

    # Section 1: Executive Summary & The Problem Solved
    story.append(Paragraph("1. Executive Summary & The Problem Solved", h2_style))
    story.append(Paragraph(
        "Modern enterprise AI deployments face a severe vulnerability: <b>standing privileges and one-time authentication</b>. "
        "When autonomous agents operate tools via the Model Context Protocol (MCP), they frequently hold long-lived ambient credentials. "
        "When an agent encounters an <b>Indirect Prompt Injection</b> within customer data, support tickets, or invoices, "
        "the agent falls victim to the <b>Confused Deputy Problem</b>, executing unauthorized transactions using its standing permissions.",
        body_style
    ))
    story.append(Paragraph(
        "<b>MCP Sentinel introduces independent runtime verification</b> between AI agents and the tools they propose to invoke. "
        "Governed by the principle: <i>'Let AI propose actions. Let security controls determine what is allowed.'</i> "
        "MCP Sentinel intercepts every JSON-RPC tool dispatch, verifies ephemeral Ed25519 workload identity claims, evaluates formal AWS Cedar policies, "
        "enforces dual-custody human-in-the-loop (HITL) step-up gates, and writes every outcome to an immutable SHA-256 Merkle audit chain.",
        body_style
    ))

    # Architecture Callout Box
    arch_box_data = [[
        Paragraph(
            "<b>Zero-Trust Pipeline:</b><br/>"
            "<code>[Untrusted Context / Attacker] &rarr; [Gemini 2.5 Flash Agent] &rarr; "
            "[MCP Sentinel Security Proxy (Non-Bypassable PEP Gate)] &rarr; [AWS Cedar PDP AST &amp; Risk Scorer] &rarr; "
            "[Single-Use HMAC Nonce Ticket] &rarr; [Protected MCP Core / Financial Ledger] &rarr; [SHA-256 Audit Chain]</code>",
            callout_style
        )
    ]]
    arch_box = Table(arch_box_data, colWidths=[530])
    arch_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f1f5f9")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#94a3b8")),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 12),
        ('RIGHTPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(arch_box)
    story.append(Spacer(1, 10))

    # Section 2: Unified Product Experiences & Navigation
    story.append(Paragraph("2. Unified Product Experiences & Route Hierarchy", h2_style))
    story.append(Paragraph(
        "The project delivers a cohesive, end-to-end product architecture uniting the public marketing identity with the operational security console:",
        body_style
    ))

    table_data = [
        [
            Paragraph("Route", table_header_style),
            Paragraph("Product View", table_header_style),
            Paragraph("Experience Context & Verified Capabilities", table_header_style)
        ],
        [
            Paragraph("<code>/</code>", table_cell_style),
            Paragraph("<b>Public Landing Page</b>", table_cell_style),
            Paragraph("Obsidian Flow design system, liquid-glass sculptural shield, interactive 10-node software architecture explorer, red-team attack previews, and direct CTA to console.", table_cell_style)
        ],
        [
            Paragraph("<code>/console</code>", table_cell_style),
            Paragraph("<b>Security Overview</b>", table_cell_style),
            Paragraph("Executive telemetry dashboard: real-time authorization throughput, enforcement ratio (94.2%), P50/P95/P99 latency ticker, and Merkle chain height.", table_cell_style)
        ],
        [
            Paragraph("<code>/accounts</code>", table_cell_style),
            Paragraph("<b>Account &amp; Ledger</b>", table_cell_style),
            Paragraph("Simulated core banking: dual account switcher (ACC-1001 vs ACC-1002), Titanium debit card freeze toggle, transaction search, and dispute modal.", table_cell_style)
        ],
        [
            Paragraph("<code>/finance</code>", table_cell_style),
            Paragraph("<b>Gemini Finance Bot</b>", table_cell_style),
            Paragraph("Conversational AI assistant: quick prompts, tool-call accordions, Cedar verdict badges, and dual-custody refund validation.", table_cell_style)
        ],
        [
            Paragraph("<code>/graph</code>", table_cell_style),
            Paragraph("<b>Authorization Graph</b>", table_cell_style),
            Paragraph("Interactive SVG Bezier topology with 4 simulation modes (normal, attack, quarantine, approval) and component inspector drawer.", table_cell_style)
        ],
        [
            Paragraph("<code>/monitor</code>", table_cell_style),
            Paragraph("<b>Live Telemetry SOC</b>", table_cell_style),
            Paragraph("Real-time event stream with decision filters (ALLOW, DENY, APPROVAL_REQUIRED), tool filters, and raw JSON modal inspector.", table_cell_style)
        ],
        [
            Paragraph("<code>/incidents</code>", table_cell_style),
            Paragraph("<b>Incident Explorer</b>", table_cell_style),
            Paragraph("Correlated multi-stage attack timeline, autonomous circuit breaker quarantine alert, and one-click quarantine reset control.", table_cell_style)
        ],
        [
            Paragraph("<code>/policies</code>", table_cell_style),
            Paragraph("<b>Cedar Policy Studio</b>", table_cell_style),
            Paragraph("Formal AWS Cedar policy IDE: static AST validator, live deployment, and Cedar Copilot (natural language to formal Cedar specification).", table_cell_style)
        ],
        [
            Paragraph("<code>/identity</code>", table_cell_style),
            Paragraph("<b>Agent Identity Matrix</b>", table_cell_style),
            Paragraph("SPIFFE-like URIs, Ed25519 scoped capability tokens, attenuated delegation chains (parent -> child), and real-time token revocation.", table_cell_style)
        ],
        [
            Paragraph("<code>/attack-lab</code>", table_cell_style),
            Paragraph("<b>Attack Simulation Lab</b>", table_cell_style),
            Paragraph("8 reproducible red-team scenarios with inline dual-custody HITL step-up approval gates and circuit breaker quarantine triggers.", table_cell_style)
        ],
        [
            Paragraph("<code>/audit</code>", table_cell_style),
            Paragraph("<b>Cryptographic Audit</b>", table_cell_style),
            Paragraph("SHA-256 forward-linked chain, live mathematical verification, and downloadable SOC 2 / NIST AI RMF executive compliance markdown.", table_cell_style)
        ]
    ]

    t = Table(table_data, colWidths=[65, 115, 350])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('GRID', (0,0), (-1,-1), 0.5, BORDER_COLOR),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor("#f8fafc")]),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(t)
    story.append(Spacer(1, 10))

    # Section 3: Core Innovations & Technical Capabilities
    story.append(Paragraph("3. Core Innovations & Zero-Trust Capabilities", h2_style))
    story.append(Paragraph(
        "&bull; <b>AWS Cedar Automated Reasoning:</b> Evaluates access control requests under strict Default-Deny semantics. Forbid rules categorically supersede permits.<br/>"
        "&bull; <b>Multi-Factor Blast Radius Engine:</b> Formally calculates risk scores: <code>Risk = min(100, Base + RoleDelta + InjectionDelta + DestructiveDelta + Velocity + Spend)</code>.<br/>"
        "&bull; <b>Single-Use Cryptographic Nonces:</b> Downstream tool code cannot execute without an unexpired, HMAC-SHA256 signed ticket tied to exact canonical arguments.<br/>"
        "&bull; <b>Autonomous Circuit Breaker:</b> Detects rapid violation velocity (3 repeated breaches within 60s) and automatically trips into QUARANTINE mode, revoking all active agent tokens.<br/>"
        "&bull; <b>Dual-Layer Architecture:</b> Live FastAPI backend + WebSockets paired with a resilient, offline-capable in-memory mock store for zero-downtime evaluation.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # Section 4: Hackathon Presentation Guide
    story.append(KeepTogether([
        Paragraph("4. Winning 3-Minute Hackathon Demo Script for Evaluators", h2_style),
        Paragraph(
            "<b>Minute 1 &mdash; Public Landing Page & Architecture (<code>http://localhost:5173</code>):</b><br/>"
            "Show the Obsidian Flow landing page. Point to the interactive 10-node architecture diagram: <i>'Evaluators, 88% of teams report AI security incidents because agents authenticate once and retain standing credentials. MCP Sentinel interposes independent verification between the agent and tools.'</i> Click <b>'Enter Security Console &rarr;'</b>.",
            bullet_style
        ),
        Paragraph(
            "<b>Minute 2 &mdash; Gemini Finance Assistant & Cedar Copilot:</b><br/>"
            "1. <b>AI Finance Bot (<code>/finance</code>):</b> Show the conversational assistant proposing refunds and balances. Notice tool-call inspection accordions and Cedar decision badges.<br/>"
            "2. <b>Policy Studio (<code>/policies</code>):</b> Open Cedar Copilot. Type: <i>'Allow financial remediation agent to issue refunds up to $75 only on active accounts'</i> &rarr; click <b>'Synthesize Cedar'</b> &rarr; instant formal Cedar AST generation!",
            bullet_style
        ),
        Paragraph(
            "<b>Minute 3 &mdash; Red-Team Attack Lab & Cryptographic Proof:</b><br/>"
            "1. <b>Attack Lab (<code>/attack-lab</code>):</b> Run Scenario 2 (<i>HITL Step-Up Gate</i>, $120 refund &gt; $50 threshold). Show the pending approval gate pop up. Click <b>'Approve &amp; Execute'</b> to demonstrate dual-custody authorization.<br/>"
            "2. <b>Audit Explorer (<code>/audit</code>):</b> Click <b>'Verify Cryptographic Integrity'</b>. Show the green attestation badge confirming 100% of SHA-256 blocks validated without tampering. Click <b>'Compliance Attestation'</b> to preview SOC 2 &amp; NIST AI RMF audit report.",
            bullet_style
        )
    ]))

    story.append(Spacer(1, 12))
    story.append(HRFlowable(width="100%", thickness=0.5, color=BORDER_COLOR, spaceAfter=8))
    story.append(Paragraph(
        "<b>MCP Sentinel Project Summary</b> &bull; Built for Hackurity 2026 &bull; Verified Implementation &bull; Zero Trust AI Security",
        ParagraphStyle('Footer', parent=styles['Normal'], fontName='Helvetica', fontSize=7.5, textColor=TEXT_MUTED, alignment=1)
    ))

    doc.build(story)
    print(f"[+] Successfully generated PDF: {output_path}")

if __name__ == "__main__":
    out_file = os.path.abspath(os.path.join(os.path.dirname(__file__), "SentinAgent_Continuous_Authorization_Report.pdf"))
    generate_pdf(out_file)
