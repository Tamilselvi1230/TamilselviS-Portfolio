import { useState, useEffect, useRef } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg: #050810; --bg2: #0a0f1e; --card: #0d1326; --card2: #111828;
    --teal: #0e7490; --teal-light: #22d3ee; --teal-mid: #0891b2;
    --gold: #c9a96e; --gold-light: #e8c98a; --rose: #c4a0b0; --rose-light: #e8c5d5;
    --text: #e8eaf0; --text-muted: #8892a4;
    --border: rgba(14,116,144,0.2); --border-gold: rgba(201,169,110,0.25);
  }
  *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
  html { scroll-behavior: smooth; }
  body { font-family:'DM Sans',sans-serif; background:var(--bg); color:var(--text); overflow-x:hidden; }

  /* NAV */
  .nav { position:fixed; top:0; left:0; right:0; z-index:100; display:flex; align-items:center; justify-content:space-between; padding:0 40px; height:64px; background:rgba(5,8,16,0.9); backdrop-filter:blur(16px); border-bottom:1px solid var(--border); }
  .nav-logo { font-family:'Cormorant Garamond',serif; font-size:1.4rem; font-weight:700; background:linear-gradient(135deg,var(--teal-light),var(--gold)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; letter-spacing:2px; cursor:pointer; }
  .nav-links { display:flex; gap:4px; align-items:center; }
  .nav-link { background:none; border:none; cursor:pointer; font-family:'Syne',sans-serif; font-size:0.68rem; font-weight:700; letter-spacing:1.2px; text-transform:uppercase; color:var(--text-muted); padding:6px 10px; border-radius:6px; transition:all 0.3s; }
  .nav-link:hover { color:var(--teal-light); background:rgba(14,116,144,0.12); }
  .nav-link.active { color:var(--teal-light); background:rgba(14,116,144,0.18); border:1px solid rgba(14,116,144,0.3); }

  /* SCROLL BAR */
  .scroll-bar { position:fixed; top:0; left:0; height:3px; z-index:200; background:linear-gradient(to right,var(--teal-light),var(--gold)); transition:width 0.1s; }

  /* SECTIONS */
  .section { padding:100px 80px; min-height:100vh; display:flex; flex-direction:column; justify-content:center; }
  .section-label { font-family:'Syne',sans-serif; font-size:0.7rem; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:var(--teal-light); margin-bottom:12px; }
  .section-title { font-family:'Cormorant Garamond',serif; font-size:clamp(2.5rem,5vw,4rem); font-weight:700; line-height:1.1; margin-bottom:56px; }
  .section-title .gold { color:var(--gold); }
  .section-title .rose { font-style:italic; color:var(--rose); }
  .section-sub { font-family:'Cormorant Garamond',serif; font-size:1.6rem; font-weight:700; color:var(--text); margin-bottom:24px; display:flex; align-items:center; gap:12px; }
  .section-sub::before { content:'◆'; color:var(--gold); font-size:1rem; }
  .section-sub::after { content:''; flex:1; height:1px; background:var(--border-gold); }

  /* HOME */
  .home-section { display:grid; grid-template-columns:1fr auto; gap:60px; align-items:center; min-height:100vh; padding:120px 80px 100px; background:radial-gradient(ellipse 60% 40% at 20% 50%,rgba(14,116,144,0.08) 0%,transparent 70%),radial-gradient(ellipse 40% 60% at 80% 30%,rgba(201,169,110,0.05) 0%,transparent 60%),var(--bg); position:relative; overflow:hidden; }
  .home-section::before { content:''; position:absolute; inset:0; background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230e7490' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); pointer-events:none; }
  .home-content { position:relative; }
  .available-badge { display:inline-flex; align-items:center; gap:8px; padding:6px 14px; border-radius:50px; border:1px solid rgba(34,211,238,0.3); background:rgba(14,116,144,0.1); font-family:'Syne',sans-serif; font-size:0.65rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--teal-light); margin-bottom:28px; }
  .pulse-dot { width:7px; height:7px; border-radius:50%; background:var(--teal-light); animation:pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.8)} }
  .home-name { font-family:'Cormorant Garamond',serif; font-size:clamp(3.5rem,7vw,6.5rem); font-weight:700; line-height:1; margin-bottom:16px; }
  .home-name .first { color:var(--text); display:block; }
  .home-name .last { background:linear-gradient(135deg,var(--gold) 0%,var(--rose) 50%,var(--rose-light) 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; display:block; }
  .home-role { font-family:'Syne',sans-serif; font-size:0.8rem; font-weight:700; letter-spacing:4px; text-transform:uppercase; color:var(--text-muted); margin-bottom:28px; }
  .home-tagline { font-size:0.95rem; line-height:1.75; color:var(--text-muted); max-width:540px; margin-bottom:40px; }
  .home-btns { display:flex; gap:16px; flex-wrap:wrap; }
  .btn-primary { padding:12px 28px; border-radius:8px; font-family:'Syne',sans-serif; font-size:0.78rem; font-weight:700; letter-spacing:1px; text-transform:uppercase; text-decoration:none; background:linear-gradient(135deg,var(--gold),var(--rose)); color:#0a0a0a; border:none; cursor:pointer; transition:all 0.3s; box-shadow:0 4px 24px rgba(201,169,110,0.25); display:inline-block; }
  .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(201,169,110,0.4); }
  .btn-secondary { padding:12px 28px; border-radius:8px; font-family:'Syne',sans-serif; font-size:0.78rem; font-weight:700; letter-spacing:1px; text-transform:uppercase; text-decoration:none; border:1px solid rgba(34,211,238,0.4); color:var(--teal-light); background:rgba(14,116,144,0.08); cursor:pointer; transition:all 0.3s; display:inline-block; }
  .btn-secondary:hover { background:rgba(14,116,144,0.18); transform:translateY(-2px); }
  .home-stats { display:grid; grid-template-columns:repeat(3,1fr); gap:0; border-top:1px solid var(--border); padding-top:40px; margin-top:48px; }
  .stat { padding:0 24px 0 0; }
  .stat:not(:last-child) { border-right:1px solid var(--border); margin-right:24px; }
  .stat-num { font-family:'Cormorant Garamond',serif; font-size:2.4rem; font-weight:700; color:var(--gold); }
  .stat-label { font-family:'Syne',sans-serif; font-size:0.6rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--text-muted); }
  .profile-card { width:280px; height:360px; background:linear-gradient(145deg,var(--card),var(--card2)); border:1px solid var(--border); border-radius:24px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:12px; position:relative; overflow:hidden; box-shadow:0 24px 60px rgba(0,0,0,0.4),inset 0 1px 0 rgba(255,255,255,0.05); }
  .profile-card::before { content:''; position:absolute; top:-50%; left:-50%; width:200%; height:200%; background:radial-gradient(circle at 50% 30%,rgba(14,116,144,0.1) 0%,transparent 50%); }
  .profile-initials { font-family:'Cormorant Garamond',serif; font-size:4rem; font-weight:700; background:linear-gradient(135deg,var(--teal-light),var(--gold)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; z-index:1; }
  .profile-label { font-size:0.75rem; color:var(--text-muted); z-index:1; }

  /* ABOUT */
  .about-section { background:radial-gradient(ellipse 50% 50% at 80% 50%,rgba(201,169,110,0.05) 0%,transparent 60%),var(--bg2); }
  .about-grid { display:grid; grid-template-columns:1.2fr 0.8fr; gap:40px; align-items:stretch; }
  .about-card { background:var(--card); border:1px solid var(--border); border-radius:20px; padding:40px; position:relative; overflow:hidden; }
  .about-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(to right,var(--teal-mid),var(--gold)); }
  .about-text { font-size:0.95rem; line-height:1.8; color:#b8c0cc; margin-bottom:20px; }
  .about-text strong { color:var(--text); }
  .about-h3 { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:700; color:var(--text); margin:24px 0 12px; border-bottom:1px solid var(--border-gold); padding-bottom:8px; }
  .about-sidebar { display:flex; flex-direction:column; gap:20px; height:100%; }
  .about-sidebar .info-card { flex:1; }
  .info-card { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:24px; }
  .info-card-title { font-family:'Syne',sans-serif; font-size:0.65rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--gold); margin-bottom:14px; display:flex; align-items:center; gap:8px; }
  .info-card h4 { font-size:1rem; font-weight:600; margin-bottom:4px; }
  .info-card p { font-size:0.82rem; color:var(--text-muted); }
  .badge { display:inline-block; padding:3px 10px; border-radius:20px; border:1px solid var(--border-gold); color:var(--gold); font-size:0.72rem; font-family:'Syne',sans-serif; font-weight:600; margin-top:10px; }
  .tag { display:inline-block; padding:4px 12px; border-radius:20px; border:1px solid var(--border); color:var(--text-muted); font-size:0.75rem; margin:4px 4px 0 0; transition:all 0.2s; cursor:default; }
  .tag:hover { border-color:var(--teal-light); color:var(--teal-light); }

  /* PROJECTS */
  .projects-list { display:flex; flex-direction:column; gap:20px; margin-bottom:60px; }
  .project-card { display:grid; grid-template-columns:200px 1fr; border:1px solid var(--border); border-radius:16px; overflow:hidden; background:var(--card); transition:all 0.3s; }
  .project-card:hover { border-color:rgba(14,116,144,0.5); transform:translateY(-2px); box-shadow:0 12px 40px rgba(0,0,0,0.3); }
  .project-icon-area { background:var(--card2); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; padding:24px; border-right:1px solid var(--border); }
  .project-icon { font-size:2.5rem; }
  .project-icon-label { font-size:0.68rem; font-family:'Syne',sans-serif; font-weight:600; text-align:center; color:var(--text-muted); text-transform:uppercase; letter-spacing:1px; }
  .project-info { padding:28px 32px; }
  .project-num { font-family:'Syne',sans-serif; font-size:0.65rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--gold); margin-bottom:6px; }
  .project-title { font-size:1.15rem; font-weight:600; margin-bottom:10px; }
  .project-desc { font-size:0.85rem; color:var(--text-muted); line-height:1.65; margin-bottom:14px; }
  .tech-tags { display:flex; flex-wrap:wrap; gap:8px; }
  .tech-tag { padding:3px 12px; border-radius:4px; background:rgba(14,116,144,0.1); border:1px solid rgba(14,116,144,0.3); font-size:0.72rem; color:var(--teal-light); font-weight:500; }

  /* EVENTS */
  .events-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  .event-card { background:var(--card); border:1px solid var(--border); border-left:3px solid var(--gold); border-radius:12px; padding:24px; transition:all 0.3s; }
  .event-card:hover { border-left-color:var(--teal-light); transform:translateY(-3px); box-shadow:0 12px 32px rgba(0,0,0,0.3); }
  .event-icon { font-size:2rem; margin-bottom:12px; }
  .event-title { font-size:0.95rem; font-weight:600; margin-bottom:6px; }
  .event-desc { font-size:0.8rem; color:var(--text-muted); line-height:1.6; }
  .event-role { display:inline-block; margin-top:10px; padding:2px 10px; border-radius:20px; font-size:0.65rem; font-family:'Syne',sans-serif; font-weight:700; letter-spacing:1px; text-transform:uppercase; background:rgba(201,169,110,0.1); border:1px solid var(--border-gold); color:var(--gold); }

  /* CERTIFICATIONS */
  .certs-section { background:var(--bg2); }
  .certs-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:16px; margin-bottom:60px; }
  .cert-card { background:var(--card); border:1px solid var(--border); border-radius:14px; overflow:hidden; cursor:pointer; transition:all 0.3s; }
  .cert-card:hover { border-color:rgba(14,116,144,0.5); transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,0.35); }
  .cert-top { padding:24px 16px 16px; display:flex; flex-direction:column; align-items:center; gap:8px; background:linear-gradient(145deg,var(--card2),var(--card)); min-height:120px; justify-content:center; position:relative; }
  .cert-provider-badge { position:absolute; top:8px; right:8px; padding:2px 8px; border-radius:4px; font-size:0.58rem; font-family:'Syne',sans-serif; font-weight:700; letter-spacing:1px; text-transform:uppercase; background:rgba(201,169,110,0.15); border:1px solid var(--border-gold); color:var(--gold-light); }
  .cert-emoji { font-size:2.2rem; }
  .cert-bottom { padding:14px 16px; }
  .cert-org { font-family:'Syne',sans-serif; font-size:0.6rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--gold); margin-bottom:4px; }
  .cert-name { font-size:0.82rem; font-weight:600; line-height:1.3; margin-bottom:8px; }
  .cert-link { font-size:0.72rem; color:var(--teal-light); font-family:'Syne',sans-serif; font-weight:600; }

  /* MODAL */
  .modal-overlay { position:fixed; inset:0; z-index:200; background:rgba(0,0,0,0.85); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; }
  .modal-inner { background:var(--card); border:1px solid var(--border); border-radius:20px; padding:40px; max-width:500px; width:90%; text-align:center; position:relative; }
  .modal-close { position:absolute; top:16px; right:16px; background:none; border:none; color:var(--text-muted); font-size:1.4rem; cursor:pointer; }
  .modal-emoji { font-size:3.5rem; margin-bottom:12px; }
  .modal-org { color:var(--gold); font-family:'Syne',sans-serif; font-size:0.7rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:8px; }
  .modal-title { font-size:1.3rem; font-weight:700; margin-bottom:20px; }
  .modal-note { font-size:0.82rem; color:var(--text-muted); line-height:1.6; }

  /* INTERNSHIPS */
  .internships-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  .intern-card { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:28px; transition:all 0.3s; }
  .intern-card:hover { border-color:rgba(14,116,144,0.4); transform:translateY(-3px); }
  .intern-badge { display:inline-flex; align-items:center; gap:6px; padding:4px 12px; border-radius:30px; font-size:0.62rem; font-family:'Syne',sans-serif; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; border:1px solid var(--border-gold); color:var(--gold-light); background:rgba(201,169,110,0.07); margin-bottom:14px; }
  .intern-badge::before { content:'●'; font-size:0.5rem; }
  .intern-company { font-size:1.15rem; font-weight:700; margin-bottom:4px; }
  .intern-role { color:var(--teal-light); font-size:0.82rem; font-weight:500; margin-bottom:4px; }
  .intern-dates { font-size:0.75rem; color:var(--text-muted); margin-bottom:14px; }
  .intern-desc { font-size:0.82rem; color:var(--text-muted); line-height:1.65; }

  /* SKILLS */
  .skills-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-bottom:60px; }
  .skill-category { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:28px; transition:all 0.3s; }
  .skill-category:hover { border-color:rgba(14,116,144,0.4); }
  .skill-cat-icon { font-size:1.8rem; margin-bottom:14px; }
  .skill-cat-title { font-family:'Syne',sans-serif; font-size:0.62rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--gold); margin-bottom:14px; }
  .skill-tags { display:flex; flex-wrap:wrap; gap:8px; }
  .skill-tag { padding:4px 12px; border-radius:6px; background:var(--card2); border:1px solid var(--border); font-size:0.78rem; color:var(--text); transition:all 0.2s; cursor:default; }
  .skill-tag:hover { border-color:var(--teal-light); color:var(--teal-light); }

  /* CODING */
  .coding-profiles { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:60px; }
  .coding-card { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:24px; text-align:center; text-decoration:none; transition:all 0.3s; display:block; }
  .coding-card:hover { border-color:rgba(34,211,238,0.4); transform:translateY(-3px); }
  .coding-platform-icon { font-size:2rem; margin-bottom:10px; }
  .coding-platform-name { font-family:'Syne',sans-serif; font-size:0.72rem; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:var(--text-muted); }
  .coding-sub { font-size:0.72rem; color:var(--teal-light); margin-top:6px; }

  /* SOFT SKILLS */
  .soft-skills-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  .soft-skill-card { background:var(--card); border:1px solid var(--border); border-radius:14px; padding:28px 20px; display:flex; flex-direction:column; align-items:center; gap:10px; transition:all 0.3s; text-align:center; }
  .soft-skill-card:hover { border-color:rgba(201,169,110,0.4); transform:translateY(-3px); }
  .soft-skill-icon { font-size:1.8rem; }
  .soft-skill-name { font-size:0.88rem; font-weight:500; }

  /* RESUME */
  .resume-section { background:var(--bg2); align-items:center; text-align:center; min-height:60vh; }
  .resume-card { background:var(--card); border:1px solid var(--border); border-radius:24px; padding:64px 80px; max-width:600px; margin:0 auto; position:relative; overflow:hidden; }
  .resume-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(to right,var(--teal-mid),var(--gold),var(--rose)); }
  .resume-icon { font-size:3rem; margin-bottom:24px; }
  .resume-title { font-family:'Cormorant Garamond',serif; font-size:2rem; font-weight:700; margin-bottom:12px; }
  .resume-sub { font-size:0.9rem; color:var(--text-muted); margin-bottom:32px; }
  .resume-btn { display:inline-flex; align-items:center; gap:10px; padding:14px 36px; border-radius:10px; font-family:'Syne',sans-serif; font-size:0.82rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; text-decoration:none; background:linear-gradient(135deg,var(--teal-mid),var(--teal)); color:white; box-shadow:0 8px 32px rgba(14,116,144,0.35); transition:all 0.3s; border:none; cursor:pointer; }
  .resume-btn:hover { transform:translateY(-3px); box-shadow:0 14px 40px rgba(14,116,144,0.5); }

  /* ACHIEVEMENTS */
  .achievements-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
  .achievement-card { background:var(--card); border:1px solid var(--border); border-radius:16px; padding:30px; transition:all 0.3s; position:relative; overflow:hidden; }
  .achievement-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:linear-gradient(to right,var(--teal-mid),transparent); opacity:0; transition:opacity 0.3s; }
  .achievement-card:hover::after { opacity:1; }
  .achievement-card:hover { border-color:rgba(14,116,144,0.4); transform:translateY(-3px); }
  .achievement-icon { font-size:2rem; margin-bottom:14px; }
  .achievement-title { font-size:1rem; font-weight:700; margin-bottom:8px; }
  .achievement-desc { font-size:0.82rem; color:var(--text-muted); line-height:1.65; }

  /* CONTACT */
  .contact-section { background:radial-gradient(ellipse 50% 50% at 50% 0%,rgba(14,116,144,0.07) 0%,transparent 60%),var(--bg2); }
  .contact-grid { display:grid; grid-template-columns:1fr 1.2fr; gap:40px; }
  .contact-info { display:flex; flex-direction:column; gap:16px; }
  .contact-item { display:flex; align-items:center; gap:16px; background:var(--card); border:1px solid var(--border); border-radius:14px; padding:20px 24px; text-decoration:none; transition:all 0.3s; color:var(--text); }
  .contact-item:hover { border-color:rgba(14,116,144,0.5); transform:translateX(6px); }
  .contact-item-icon { width:42px; height:42px; border-radius:10px; background:rgba(14,116,144,0.15); display:flex; align-items:center; justify-content:center; font-size:1.1rem; flex-shrink:0; }
  .contact-item-label { font-family:'Syne',sans-serif; font-size:0.6rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--text-muted); display:block; margin-bottom:2px; }
  .contact-item-value { font-size:0.88rem; color:var(--text); font-weight:500; }
  .contact-form-card { background:var(--card); border:1px solid var(--border); border-radius:20px; padding:40px; position:relative; overflow:hidden; }
  .contact-form-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(to right,var(--teal-mid),var(--gold)); }
  .form-title { font-family:'Cormorant Garamond',serif; font-size:1.5rem; font-weight:700; margin-bottom:24px; display:flex; align-items:center; gap:10px; }
  .form-group { margin-bottom:18px; }
  .form-label { display:block; font-family:'Syne',sans-serif; font-size:0.62rem; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--text-muted); margin-bottom:8px; }
  .form-input,.form-textarea { width:100%; padding:12px 16px; background:var(--card2); border:1px solid var(--border); border-radius:8px; color:var(--text); font-family:'DM Sans',sans-serif; font-size:0.88rem; outline:none; transition:all 0.3s; resize:vertical; }
  .form-input:focus,.form-textarea:focus { border-color:var(--teal-mid); background:#0f1a28; }
  .form-textarea { min-height:110px; }
  .form-btn { width:100%; padding:14px; background:linear-gradient(135deg,var(--gold),var(--rose)); border:none; border-radius:8px; cursor:pointer; font-family:'Syne',sans-serif; font-size:0.82rem; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; color:#0a0a0a; transition:all 0.3s; margin-top:4px; }
  .form-btn:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(201,169,110,0.35); }
  .form-note { text-align:center; font-size:0.72rem; color:var(--text-muted); margin-top:12px; }

  /* FOOTER */
  .footer { padding:30px 80px; border-top:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; font-size:0.78rem; color:var(--text-muted); }
  .footer-links { display:flex; gap:16px; }
  .footer-link { color:var(--text-muted); text-decoration:none; transition:color 0.2s; }
  .footer-link:hover { color:var(--teal-light); }

  /* SPARKLE TRAIL */
  .btn-sparkle { position:relative; overflow:visible; }
  .sparkle { position:absolute; pointer-events:none; border-radius:50%; animation:sparkle-fade 0.6s ease-out forwards; }
  @keyframes sparkle-fade {
    0%   { opacity:1; transform:scale(1) translate(0,0); }
    100% { opacity:0; transform:scale(0) translate(var(--tx),var(--ty)); }
  }
  @keyframes arrow-bounce {
    0%,100% { transform:translateX(0); }
    50%      { transform:translateX(5px); }
  }
  .btn-sparkle:hover .arrow-char { display:inline-block; animation:arrow-bounce 0.5s ease infinite; }
  .arrow-char { display:inline-block; }
  .fade-in { opacity:0; transform:translateY(20px); transition:opacity 0.5s ease,transform 0.5s ease; }
  .fade-in.visible { opacity:1; transform:translateY(0); }

  @media(max-width:1100px) {
    .section,.home-section { padding:80px 40px; }
    .certs-grid { grid-template-columns:repeat(3,1fr); }
    .events-grid { grid-template-columns:repeat(2,1fr); }
    .skills-grid { grid-template-columns:repeat(2,1fr); }
  }
  @media(max-width:768px) {
    .nav { padding:0 20px; } .nav-links { display:none; }
    .section,.home-section { padding:70px 24px; }
    .home-section { grid-template-columns:1fr; }
    .profile-card { display:none; }
    .about-grid,.contact-grid { grid-template-columns:1fr; }
    .certs-grid { grid-template-columns:repeat(2,1fr); }
    .events-grid,.soft-skills-grid,.achievements-grid,.internships-grid { grid-template-columns:1fr; }
    .coding-profiles { grid-template-columns:repeat(2,1fr); }
    .skills-grid { grid-template-columns:1fr; }
    .footer { flex-direction:column; gap:8px; text-align:center; }
  }
`;

// ─── DATA ───────────────────────────────────────────────
const NAV_ITEMS = ["home","about","projects","certifications","skills","resume","achievements","contact"];

const PROJECTS = [
  { num:"01", icon:"🎙️", label:"VaniSaarthi", title:"VaniSaarthi", desc:"An AI-integrated voice-guided form automation system designed to enhance accessibility and user efficiency.", techs:["AI","Voice Recognition","React","Python"] },
  { num:"02", icon:"🌾", label:"Farm2Fork", title:"Farm2Fork", desc:"Developed a web application connecting farmers and consumers to enhance efficiency and social impact, using blockchain for supply chain integrity.", techs:["React","CSS","JS","MySQL","Blockchain"] },
  { num:"03", icon:"⚡", label:"Energy Pulse", title:"Energy Pulse", desc:"An AI-Enabled Biometric Energy Optimization System for Personalized and Wellness-Oriented Smart Homes.", techs:["AI","ML","IoT","Blockchain","Data Analytics"] },
  { num:"04", icon:"🍽️", label:"Recipe App", title:"Recipe App", desc:"A full-stack Recipe Explorer application with a dynamic React frontend and FastAPI backend.", techs:["Python (FastAPI)","React"] },
  { num:"05", icon:"🚗", label:"TrailBlaze X", title:"TrailBlaze X", desc:"A smart vehicle safety solution using hardware sensors and analytics to enhance performance.", techs:["Arduino","Sensors","Python Analytics"] },
  { num:"06", icon:"🔐", label:"CVE Database", title:"CVE Database", desc:"A full-stack handling system with custom search and filter endpoints via API integration.", techs:["React","Python"] },
  { num:"07", icon:"🔄", label:"Format Converter", title:"Format Converter", desc:"A system for converting JSON files to XML using API integration and backend logic.", techs:["Python","React"] },
];

const EVENTS = [
  { icon:"🏅", title:"Smart India Hackathon (SIH)", desc:"Developed a web application connecting farmers and consumers to enhance efficiency and social impact — advanced to semi-finals.", role:"Semi-Finalist" },
  { icon:"🐛", title:"Bug Busters", desc:"Headed the planning and execution of this flagship debugging competition.", role:"Lead Organizer" },
  { icon:"🏆", title:"Sweden National Competition", desc:"Represented and competed in a high-level international stage.", role:"Participant" },
  { icon:"🌐", title:"International Conference", desc:"Presented or participated in global technical discourse and research.", role:"Participant" },
  { icon:"💻", title:"College & Dept Coding Events", desc:"Engaged in various competitive programming and hackathon events at Panimalar Engineering College.", role:"Participant" },
  { icon:"🎵", title:"Music Events", desc:"Actively participated in cultural events, showcasing a well-rounded personality.", role:"Participant" },
];

const CERTS = [
  { emoji:"📊", org:"NASSCOM", name:"Data Science for Beginners", link:"https://cdn.phototourl.com/uploads/2026-02-23-40a563c7-bb51-47da-a246-6ad2bf5cc69c.jpg" },
  { emoji:"🔬", org:"NPTEL", name:"Data Science for Engineers", link:null },
  { emoji:"📡", org:"VOIS", name:"Data Collection with Sensors", link:"https://cdn.phototourl.com/uploads/2026-02-23-53fe128b-8fa7-4b05-91df-2c9f2199f902.png" },
  { emoji:"📈", org:"UNIATHENA", name:"Power BI & Business Analysis Basics", link:"https://cdn.phototourl.com/uploads/2026-02-23-ce1b276a-7d87-4cb1-9f5c-e01711943d2b.jpg" },
  { emoji:"☁️", org:"ORACLE", name:"Oracle Cloud Infrastructure Gen AI", link:"https://cdn.phototourl.com/uploads/2026-02-23-b7e4308d-77f7-4006-bffa-66298bdf94ac.jpg" },
  { emoji:"🤖", org:"INFOSYS SPRINGBOARD", name:"Introduction to AI (Google Cloud)", link:"https://cdn.phototourl.com/uploads/2026-02-23-073450c4-5b43-44d3-8c3a-0f5c4a1ca94e.jpg" },
  { emoji:"🧠", org:"UDEMY", name:"LLMs with Google Cloud & Python", link:"https://cdn.phototourl.com/uploads/2026-02-23-403ae5c9-ca21-40f7-98c6-c0d0f4526b20.jpg" },
  { emoji:"🎨", org:"UDEMY", name:"UI/UX Design", link:"https://cdn.phototourl.com/uploads/2026-02-23-f5d625ed-3a8a-4135-b429-5f885bb5495d.jpg" },
  { emoji:"✍️", org:"SIMPLILEARN", name:"Prompt Engineering", link:"https://cdn.phototourl.com/uploads/2026-02-23-b37fa3be-057d-41a0-b8ff-3553d73548bd.jpg" },
  { emoji:"💼", org:"SIMPLILEARN", name:"Business Analyst", link:"https://cdn.phototourl.com/uploads/2026-02-23-03ed2bf8-a4a440fe-9ed2-43befa8813f2.jpg" },
];

const INTERNSHIPS = [
  { badge:"Data Analyst Internship", company:"Iconic Global Company", role:"🔵 Data Analyst Intern", dates:"June 2025", desc:"Analyzed government datasets using Excel to clean, structure, and validate data; developed interactive Power BI dashboards to visualize KPIs and trends.", link:"https://cdn.phototourl.com/uploads/2026-02-23-d46da0f4-cfe5-4e62-8fd4-6fcfc7f149c7.png" },
  { badge:"Data Science Internship", company:"Internshala", role:"🟣 Data Science Intern", dates:"Jan – Mar 2025", desc:"Created interactive dashboards in Tableau and Power BI for real-time analysis and generated reports to support data-driven decision-making.", link:"https://cdn.phototourl.com/uploads/2026-02-23-0f06f0a3-2047-4f97-a213-bcb4f47be6a0.jpg" },
  { badge:"HR Internship", company:"Academor Institute", role:"🟠 HR Intern", dates:"Aug – Sept 2024", desc:"Mastered HR workflows including onboarding, employee engagement, and talent management.", link:"https://cdn.phototourl.com/uploads/2026-02-23-6ba8edac-f52f-4585-8782-0fb4a00bbcdb.png" },
];

const SKILL_CATS = [
  { icon:"💻", title:"Programming", skills:["Java","Python","C","DSA (Python)","OOP"] },
  { icon:"🌐", title:"Web Technologies", skills:["HTML","CSS","JavaScript","React"] },
  { icon:"🗄️", title:"Databases", skills:["MySQL","Oracle"] },
  { icon:"📊", title:"Data & Analytics", skills:["Power BI","Excel","Tableau","Prompting"] },
  { icon:"🛠️", title:"Tools & Platforms", skills:["GitHub","VS Code","Vercel","Eclipse","Jupyter Notebook"] },
  { icon:"💾", title:"Backend Development", skills:["REST APIs","Python","Authentication Basics","CRUD Operations"] },
];

const CODING_PROFILES = [
  { icon:"🟠", name:"LeetCode", sub:"200+ Problems", href:"https://leetcode.com/u/STamilselvi/" },
  { icon:"🟢", name:"GeeksForGeeks", sub:"DSA Practice", href:"https://www.geeksforgeeks.org/profile/tsvitnsxv?tab=activity" },
  { icon:"⚫", name:"GitHub", sub:"Open Source", href:"https://github.com/Tamilselvi1230" },
  { icon:"🟩", name:"HackerRank", sub:"Challenges", href:"https://www.hackerrank.com/profile/tamilselvis_2111" },
];

const SOFT_SKILLS = [
  { icon:"👥", name:"Team Management" },
  { icon:"🗣️", name:"Communication Skills" },
  { icon:"💡", name:"Creative Thinking" },
  { icon:"⚖️", name:"Decision-Making Skills" },
  { icon:"🎤", name:"Presentation Skills" },
  { icon:"⏱️", name:"Time Management" },
];

const ACHIEVEMENTS = [
  { icon:"🥈", title:"KPIT Semi-Finalist", desc:"Reached the semi-finals of the prestigious KPIT competition, demonstrating outstanding technical innovation and problem-solving." },
  { icon:"🥈", title:"SIH Semi-Finalist", desc:"Advanced to the semi-finals of Smart India Hackathon, showcasing the ability to build impactful solutions for real-world national challenges." },
  { icon:"🏆", title:"Sweden National Competition", desc:"Represented at a high-level international competition, showcasing technical skills on a global stage." },
  { icon:"📊", title:"200+ LeetCode Problems", desc:"Solved over 200 programming challenges using Python and Java, demonstrating strong DSA foundations." },
  { icon:"🎓", title:"10+ Certifications", desc:"Earned 10+ industry-recognized certifications from NPTEL, Oracle, NASSCOM, Udemy, Simplilearn, and more." },
  { icon:"💼", title:"3 Internships Completed", desc:"Successfully completed internships in Data Analytics, Data Science, and HR across reputed organizations." },
];

const CONTACT_ITEMS = [
  { icon:"📧", label:"EMAIL", value:"s.tamilselvi1313@gmail.com", href:"mailto:s.tamilselvi1313@gmail.com" },
  { icon:"📞", label:"PHONE", value:"+91 790495234", href:null },
  { icon:"💼", label:"LINKEDIN", value:"linkedin.com/in/tamilselvi-s-445079297", href:"https://www.linkedin.com/in/tamilselvi-s-445079297/" },
  { icon:"🟠", label:"LEETCODE", value:"leetcode.com/u/STamilselvi", href:"https://leetcode.com/u/STamilselvi/" },
  { icon:"📍", label:"LOCATION", value:"Chennai, Tamil Nadu", href:null },
  { icon:"🐙", label:"GITHUB", value:"github.com/Tamilselvi1230", href:"https://github.com/Tamilselvi1230" },
];

// ─── FADE IN HOOK ───────────────────────────────────────
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── SMALL REUSABLE COMPONENTS ──────────────────────────
function FadeCard({ className, children, style: s, onClick }) {
  const ref = useFadeIn();
  return <div ref={ref} className={`fade-in ${className}`} style={s} onClick={onClick}>{children}</div>;
}
function SectionSub({ children }) {
  return <div className="section-sub">{children}</div>;
}

// ─── SPARKLE BUTTON ─────────────────────────────────────
const SPARKLE_COLORS = ["#22d3ee","#c9a96e","#e8c5d5","#ffffff","#c4a0b0","#e8c98a"];

function SparkleButton({ onClick, children }) {
  const btnRef = useRef(null);

  const createSparkle = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    for (let i = 0; i < 10; i++) {
      const sparkle = document.createElement("span");
      sparkle.className = "sparkle";
      const size = Math.random() * 8 + 4;
      const angle = Math.random() * 360;
      const dist = Math.random() * 50 + 20;
      const tx = Math.cos((angle * Math.PI) / 180) * dist + "px";
      const ty = Math.sin((angle * Math.PI) / 180) * dist + "px";
      const color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
      Object.assign(sparkle.style, {
        left: x + "px", top: y + "px",
        width: size + "px", height: size + "px",
        background: color,
        boxShadow: `0 0 ${size}px ${color}`,
        "--tx": tx, "--ty": ty,
      });
      btn.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 600);
    }
  };

  return (
    <button
      ref={btnRef}
      className="btn-primary btn-sparkle"
      onClick={onClick}
      onMouseMove={createSparkle}
    >
      {children}
    </button>
  );
}

// ─── SECTIONS ───────────────────────────────────────────
function Home({ scrollTo }) {
  return (
    <section id="home" className="home-section">
      <div className="home-content">
        <div className="available-badge">
          <span className="pulse-dot" />
          Open to Work
        </div>
        <div className="home-name">
          <span className="first">TAMILSELVI S</span>
        </div>
        <div className="home-role">Technology Enthusiast · IT Graduate · AI Enthusiast</div>
        <p className="home-tagline">
          Technology enthusiast and IT Graduate with expertise in full-stack development and data analytics, leveraging Java, Python, DSA, DBMS, Power BI, React, and UI/UX to design scalable, data-driven solutions that combine performance, usability, and innovation.
        </p>
        <div className="home-btns">
          <SparkleButton onClick={() => scrollTo("projects")}>View Projects <span className="arrow-char">→</span></SparkleButton>
          <a className="btn-secondary" href="https://www.linkedin.com/in/tamilselvi-s-445079297/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
        </div>
        <div className="home-stats">
          <div className="stat"><div className="stat-num">200+</div><div className="stat-label">LeetCode Problems Solved</div></div>
          <div className="stat"><div className="stat-num">10+</div><div className="stat-label">Certifications Earned</div></div>
          <div className="stat"><div className="stat-num">3rd</div><div className="stat-label">Year B.Tech IT Student</div></div>
        </div>
      </div>
      
<div className="profile-card">
  <div className="profile-initials">TSV</div>
  <div className="profile-label">Tamilselvi S Profile Photo</div>
</div>    </section>
  );
}

function About() {
  return (
    <section id="about" className="section about-section">
      <div className="section-label">GET TO KNOW ME</div>
      <div className="section-title">About <em className="rose">Me</em></div>
      <div className="about-grid">
        <div className="about-card">
          <p className="about-text">Hello, I am a <strong>software developer.</strong></p>
          <p className="about-text">Ambitious developer with a strong foundation in Java, Python, DSA, Power BI, DBMS and web development, eager to build innovative data-driven and technology solutions and prompt engineering to solve the real world problems so easily.</p>
          <p className="about-text">As being a curious explorer,</p>
          <p className="about-text">I want to make my journey beautiful and productive, and I truly believe in <strong>"enjoying the process while reaching your destination."</strong> I want to put commas in my journey — not full stops.</p>
          <div className="about-h3">My Journey</div>
          <p className="about-text">My curiosity for technology began at an early age, and it has only grown stronger over the years. I believe in continuous learning and staying updated with the latest industry trends. When I'm not coding, I enjoy participating in hackathons, international conferences, and exploring new technologies and AI innovations.</p>
        </div>
        <div className="about-sidebar">
          <div className="info-card">
            <div className="info-card-title">🎓 EDUCATION</div>
            <h4>Bachelor of Technology (B.Tech)</h4>
            <p>Information Technology · 3rd Year</p>
            <div className="badge">Expected Graduation: 2027</div>
          </div>
          <div className="info-card">
            <div className="info-card-title">✨ INTERESTS</div>
            <div>
              {["Data Analytics","Data Visualization","Designing","AI Prompting","Web Development","Business Intelligence"].map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>
          <div className="info-card">
            <div className="info-card-title">📍 LOCATION</div>
            <p>Chennai, Tamil Nadu</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section id="projects" className="section">
      <div className="section-label">WHAT I'VE BUILT</div>
      <div className="section-title">Projects <span className="gold">&</span> <em className="rose">Events</em></div>
      <SectionSub>Projects</SectionSub>
      <div className="projects-list">
        {PROJECTS.map(p => (
          <FadeCard key={p.num} className="project-card">
            <div className="project-icon-area">
              <div className="project-icon">{p.icon}</div>
              <div className="project-icon-label">{p.label}</div>
            </div>
            <div className="project-info">
              <div className="project-num">Project {p.num}</div>
              <div className="project-title">{p.title}</div>
              <p className="project-desc">{p.desc}</p>
              <div className="tech-tags">{p.techs.map(t => <span key={t} className="tech-tag">{t}</span>)}</div>
            </div>
          </FadeCard>
        ))}
      </div>
      <SectionSub>Events & Contributions</SectionSub>
      <div className="events-grid">
        {EVENTS.map(e => (
          <FadeCard key={e.title} className="event-card">
            <div className="event-icon">{e.icon}</div>
            <div className="event-title">{e.title}</div>
            <p className="event-desc">{e.desc}</p>
            <span className="event-role">{e.role}</span>
          </FadeCard>
        ))}
      </div>
    </section>
  );
}

function Certifications() {
  const [modal, setModal] = useState(null);
  return (
    <section id="certifications" className="section certs-section">
      <div className="section-label">CREDENTIALS</div>
      <div className="section-title">Certifications <span className="gold">&</span> <em className="rose">Internships</em></div>
      <SectionSub>Certifications</SectionSub>
      <p style={{fontSize:"0.82rem",color:"var(--text-muted)",marginBottom:"24px"}}>Click any card to view the certificate.</p>
      <div className="certs-grid">
        {CERTS.map(c => (
          <FadeCard key={c.name} className="cert-card" onClick={() => setModal(c)}>
            <div className="cert-top">
              <span className="cert-provider-badge">{c.org.split(" ")[0]}</span>
              <div className="cert-emoji">{c.emoji}</div>
            </div>
            <div className="cert-bottom">
              <div className="cert-org">{c.org}</div>
              <div className="cert-name">{c.name}</div>
              <div className="cert-link">View Certificate →</div>
            </div>
          </FadeCard>
        ))}
      </div>
      <SectionSub>Internships</SectionSub>
      <div className="internships-grid">
        {INTERNSHIPS.map(i => (
  <FadeCard key={i.company} className="intern-card">
    <div className="intern-badge">{i.badge}</div>
    <div className="intern-company">{i.company}</div>
    <div className="intern-role">{i.role}</div>
    <div className="intern-dates">{i.dates}</div>
    <p className="intern-desc">{i.desc}</p>
    {i.link && (
      <a href={i.link} target="_blank" rel="noreferrer"
        style={{display:"inline-block", marginTop:"14px", fontSize:"0.75rem", fontFamily:"'Syne',sans-serif", fontWeight:"700", color:"var(--teal-light)", textDecoration:"none", border:"1px solid rgba(34,211,238,0.3)", padding:"6px 14px", borderRadius:"6px"}}>
        🏅 View Certificate →
      </a>
    )}
  </FadeCard>
))}
      </div>
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
<div className="modal-inner" onClick={e => e.stopPropagation()} style={{maxWidth:"700px", width:"90%", maxHeight:"90vh", overflowY:"auto"}}>
            <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            <div className="modal-emoji">{modal.emoji}</div>
            <div className="modal-org">{modal.org}</div>
            <div className="modal-title">{modal.name}</div>
            {modal.link
  ? <img src={modal.link} alt={modal.name} style={{width:"100%", borderRadius:"12px", marginTop:"8px"}} />
  : <p className="modal-note">Certificate not available yet.</p>
}
          </div>
        </div>
      )}
    </section>
  );
}

function Skills() {
  return (
    <section id="skills" className="section">
      <div className="section-label">CAPABILITIES</div>
      <div className="section-title">My <em className="rose">Skills</em></div>
      <SectionSub>Technical Skills</SectionSub>
      <div className="skills-grid">
        {SKILL_CATS.map(c => (
          <FadeCard key={c.title} className="skill-category">
            <div className="skill-cat-icon">{c.icon}</div>
            <div className="skill-cat-title">{c.title}</div>
            <div className="skill-tags">{c.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}</div>
          </FadeCard>
        ))}
      </div>
      <SectionSub>Coding Profiles</SectionSub>
      <div className="coding-profiles">
        {CODING_PROFILES.map(p => (
          <a key={p.name} className="coding-card" href={p.href} target="_blank" rel="noreferrer">
            <div className="coding-platform-icon">{p.icon}</div>
            <div className="coding-platform-name">{p.name}</div>
            <div className="coding-sub">{p.sub}</div>
          </a>
        ))}
      </div>
      <SectionSub>Soft Skills</SectionSub>
      <div className="soft-skills-grid">
        {SOFT_SKILLS.map(s => (
          <FadeCard key={s.name} className="soft-skill-card">
            <div className="soft-skill-icon">{s.icon}</div>
            <div className="soft-skill-name">{s.name}</div>
          </FadeCard>
        ))}
      </div>
    </section>
  );
}

function Resume() {
  return (
    <section id="resume" className="section resume-section">
      <div className="resume-card">
        <div className="resume-icon">📄</div>
        <div className="resume-title">My Resume</div>
        <p className="resume-sub">Download or view my full resume to learn more about my experience, skills, and academic achievements.</p>
       <a className="resume-btn" href="https://pdflink.to/b99160bc/" target="_blank" rel="noreferrer">⬇ Download Resume PDF</a>
        
      </div>
    </section>
  );
}

function Achievements() {
  return (
    <section id="achievements" className="section">
      <div className="section-label">MILESTONES</div>
      <div className="section-title">My <em className="rose">Achievements</em></div>
      <div className="achievements-grid">
        {ACHIEVEMENTS.map(a => (
          <FadeCard key={a.title} className="achievement-card">
            <div className="achievement-icon">{a.icon}</div>
            <div className="achievement-title">{a.title}</div>
            <p className="achievement-desc">{a.desc}</p>
          </FadeCard>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const submit = () => {
    if (!form.name || !form.email || !form.message) { alert("Please fill all required fields."); return; }
    window.location.href = `mailto:s.tamilselvi1313@gmail.com?subject=${encodeURIComponent(form.subject||"Portfolio Contact")}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`)}`;
  };
  return (
    <section id="contact" className="section contact-section">
      <div className="section-label">LET'S CONNECT</div>
      <div className="section-title">Get In <em className="rose">Touch</em></div>
      <div className="contact-grid">
        <div className="contact-info">
          {CONTACT_ITEMS.map(c => (
            <a key={c.label} className="contact-item" href={c.href || undefined} target={c.href ? "_blank" : undefined} rel="noreferrer" style={!c.href ? {cursor:"default"} : {}}>
              <div className="contact-item-icon">{c.icon}</div>
              <div>
                <span className="contact-item-label">{c.label}</span>
                <div className="contact-item-value">{c.value}</div>
              </div>
            </a>
          ))}
        </div>
        <div className="contact-form-card">
          <div className="form-title">Send a Message 💌</div>
          {[["YOUR NAME","name","text","Enter your name"],["YOUR EMAIL","email","email","your@email.com"],["SUBJECT","subject","text","What's this about?"]].map(([label,name,type,ph]) => (
            <div className="form-group" key={name}>
              <label className="form-label">{label}</label>
              <input className="form-input" type={type} name={name} placeholder={ph} value={form[name]} onChange={handle} />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">MESSAGE</label>
            <textarea className="form-textarea" name="message" placeholder="Type your message here..." value={form.message} onChange={handle} />
          </div>
          <button className="form-btn" onClick={submit}>Send Message →</button>
          <p className="form-note">Your message will be sent to s.tamilselvi1313@gmail.com</p>
        </div>
      </div>
    </section>
  );
}

// ─── MAIN APP ───────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrollPct, setScrollPct] = useState(0);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 64, behavior: "smooth" });
  };

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollPct((scrollTop / scrollH) * 100);
      const sections = NAV_ITEMS.map(id => document.getElementById(id)).filter(Boolean);
      let current = "home";
      sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 100) current = sec.id; });
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{style}</style>
      <div className="scroll-bar" style={{ width: `${scrollPct}%` }} />
      <nav className="nav">
        <div className="nav-logo" onClick={() => scrollTo("home")}>TSV</div>
        <div className="nav-links">
          {NAV_ITEMS.map(id => (
            <button key={id} className={`nav-link ${activeSection === id ? "active" : ""}`} onClick={() => scrollTo(id)}>
              {id.toUpperCase()}
            </button>
          ))}
        </div>
      </nav>
      <Home scrollTo={scrollTo} />
      <About />
      <Projects />
      <Certifications />
      <Skills />
      <Resume />
      <Achievements />
      <Contact />
      <footer className="footer">
        <div>© 2025 Tamilselvi S · Software Developer & AI Enthusiast</div>
        <div className="footer-links">
          <a className="footer-link" href="https://github.com/Tamilselvi1230" target="_blank" rel="noreferrer">GitHub</a>
          <a className="footer-link" href="https://www.linkedin.com/in/tamilselvi-s-445079297/" target="_blank" rel="noreferrer">LinkedIn</a>
          <a className="footer-link" href="mailto:s.tamilselvi1313@gmail.com">Email</a>
        </div>
      </footer>
    </>
  );
}
