'use client';

import React from 'react';

export default function Page() {
  return (
    <div
      style={{
        fontFamily: 'Inter, sans-serif',
        background: '#f9fbff',
        minHeight: '100vh',
        padding: '20px'
      }}
    >
      {/* HEADER */}
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: '#0a1a33' }}>
            Share to Earn
          </h1>
          <div style={{ color: '#6b7280', fontSize: '14px' }}>One link — instant income</div>
        </div>

        <button
          id="langBtn"
          style={{
            padding: '10px 20px',
            borderRadius: '12px',
            border: '1px solid #d8e2f5',
            background: '#ffffff',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          عربي
        </button>
      </div>

      {/* MAIN CARD */}
      <div
        style={{
          maxWidth: '900px',
          margin: '25px auto',
          background: '#fff',
          borderRadius: '18px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          border: '1px solid #eef2ff'
        }}
      >
        <h2
          style={{
            fontSize: '32px',
            fontWeight: '800',
            margin: 0,
            color: '#0a1a33'
          }}
        >
          Get your affiliate link
        </h2>

        <p style={{ marginTop: '10px', color: '#6b7280', fontSize: '16px' }}>
          Fill name + email — we will create your personal link instantly.
        </p>

        {/* BUTTONS */}
        <div
          style={{
            display: 'flex',
            gap: '14px',
            marginTop: '22px'
          }}
        >
          <button
            id="getBtn"
            style={{
              flex: 1,
              padding: '16px 20px',
              borderRadius: '14px',
              background: '#0a1a33',
              color: '#fff',
              fontSize: '18px',
              fontWeight: '700',
              border: '0',
              cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(0,0,0,0.12)'
            }}
          >
            Get My Link
          </button>

          <button
            id="payoutBtn"
            style={{
              flex: 1,
              padding: '16px 20px',
              borderRadius: '14px',
              background: '#ffffff',
              color: '#0a1a33',
              border: '1px dashed #dce4f7',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Payout · $0.00
          </button>

          <button
            id="contactBtn"
            style={{
              flex: 1,
              padding: '16px 20px',
              borderRadius: '14px',
              background: '#ffffff',
              color: '#0a1a33',
              border: '1px solid #d8e0f0',
              fontSize: '18px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Contact Us
          </button>
        </div>

        {/* FORM (Hidden until clicking Get My Link) */}
        <div id="formSection" style={{ marginTop: '35px', display: 'none' }}>
          <label style={{ fontSize: '15px', fontWeight: '600' }}>Full name</label>
          <input
            id="nameInput"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #e2e8f5',
              marginTop: '6px',
              marginBottom: '16px'
            }}
            placeholder="Your full name"
          />

          <label style={{ fontSize: '15px', fontWeight: '600' }}>Email</label>
          <input
            id="emailInput"
            type="email"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #e2e8f5',
              marginTop: '6px',
              marginBottom: '16px'
            }}
            placeholder="Email address"
          />

          <label style={{ fontSize: '15px', fontWeight: '600' }}>WhatsApp (optional)</label>
          <input
            id="wInput"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #e2e8f5',
              marginTop: '6px'
            }}
            placeholder="WhatsApp number"
          />

          {/* SAVE */}
          <button
            id="saveBtn"
            style={{
              width: '100%',
              marginTop: '25px',
              padding: '16px',
              borderRadius: '14px',
              border: 0,
              background: '#0a1a33',
              color: '#fff',
              fontWeight: '700',
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            Save & Generate Link
          </button>

          {/* TRACKING LINK */}
          <div style={{ marginTop: '20px' }}>
            <div style={{ color: '#6b7280', marginBottom: '6px' }}>Your tracking link</div>

            <div
              id="preview"
              style={{
                background: '#f3f6ff',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #e6eaff',
                wordBreak: 'break-all'
              }}
            >
              No link yet
            </div>
          </div>
        </div>
      </div>

      {/* JS LOGIC */}
      <script dangerouslySetInnerHTML={{
        __html: `
          const getBtn = document.getElementById('getBtn');
          const form = document.getElementById('formSection');
          const saveBtn = document.getElementById('saveBtn');
          const preview = document.getElementById('preview');
          const langBtn = document.getElementById('langBtn');
          const contactBtn = document.getElementById('contactBtn');

          getBtn.onclick = () => {
            form.style.display = 'block';
            window.scrollTo({ top: form.offsetTop - 20, behavior: 'smooth' });
          };

          contactBtn.onclick = () => {
            window.location.href = 'mailto:hello@genio.systems';
          };

          saveBtn.onclick = () => {
            const name = document.getElementById('nameInput').value.trim();
            const email = document.getElementById('emailInput').value.trim();
            if(!email){ alert('Email required'); return; }

            const key = Math.random().toString(36).substring(2,10);
            const link = window.location.origin + '/r/' + key;

            preview.textContent = link;
            navigator.clipboard.writeText(link);
          };

        `
      }} />
    </div>
  );
}
