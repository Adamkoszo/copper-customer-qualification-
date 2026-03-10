import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentPhase, setCurrentPhase] = useState('critical');
  const [answers, setAnswers] = useState({});
  const [copperContext, setCopperContext] = useState(null);
  const [qualification, setQualification] = useState(null);
  const [loading, setLoading] = useState(true);

  // Copper SDK integration
  useEffect(() => {
    // Try multiple ways to get Copper context
    const initializeCopperContext = async () => {
      // Method 1: Try CopperSdk (most common)
      if (window.CopperSdk) {
        try {
          const context = window.CopperSdk.getContext();
          if (context && context.entityId) {
            setCopperContext(context);
            console.log('✅ Copper context loaded via CopperSdk:', context);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.log('⚠️ CopperSdk.getContext() failed:', error.message);
        }
      }

      // Method 2: Try to get from window.location or URL params
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const entityId = urlParams.get('entity_id') || urlParams.get('entityId');
        const entityName = urlParams.get('entity_name') || urlParams.get('entityName');
        const entityType = urlParams.get('entity_type') || urlParams.get('entityType') || 'Lead';

        if (entityId) {
          const urlContext = {
            entityId,
            entityType,
            data: { name: entityName || 'Customer' }
          };
          setCopperContext(urlContext);
          console.log('✅ Copper context loaded via URL params:', urlContext);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.log('⚠️ URL param extraction failed:', error.message);
      }

      // Method 3: Wait for SDK with loop (up to 3 seconds)
      for (let i = 0; i < 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (window.CopperSdk) {
          try {
            const context = window.CopperSdk.getContext();
            if (context && context.entityId) {
              setCopperContext(context);
              console.log('✅ Copper context loaded after retry:', context);
              setLoading(false);
              return;
            }
          } catch (e) {
            // Continue trying
          }
        }
      }

      // Fallback: Use test data if nothing else worked
      console.log('⚠️ No Copper context found - using test data (you may be testing outside Copper)');
      setCopperContext({
        entityId: 'test-123',
        entityType: 'Lead',
        data: { name: 'Test Customer' }
      });
      setLoading(false);
    };

    initializeCopperContext();
  }, []);

  // CRITICAL PHASE Questions (3-5 min)
  const criticalQuestions = [
    {
      id: 'khr_status',
      question: '🔴 KHR státusza?',
      options: ['Jó', 'Figyelmeztetés', 'Blokkolt'],
      field: '[CREDIT] KHR Status'
    },
    {
      id: 'employment',
      question: '🔴 Foglalkoztatási helyzet?',
      options: ['Féléves munkakontrakt+', 'GYED/GYES', 'Saját vállalkozás'],
      field: '[INC] Foglalkoztatási Státusz'
    },
    {
      id: 'property_type',
      question: '🔴 Ingatlan típusa?',
      options: ['Tégla', 'Vályog', 'Tanya/Nyaraló'],
      field: '[PROP] Ingatlantípus'
    },
    {
      id: 'income_type',
      question: '🔴 Jövedelem típusa?',
      options: ['Fizetés', 'Vállalkozás', 'Speciális (osztalék, külföldi)'],
      field: '[INC] Jövedelem Típusa'
    },
    {
      id: 'jtm',
      question: '🔴 JTM % becsült értéke?',
      options: ['0-30%', '30-50%', '50%+'],
      field: '[BC] JTM %'
    },
    {
      id: 'existing_debt',
      question: '🔴 Meglévő hitelek/tartozások?',
      options: ['Nincs', '<500k', '500k+'],
      field: '[FIN] Meglévő Adósságok'
    },
    {
      id: 'bank_preference',
      question: '🔴 Preferált bank?',
      options: ['OTP', 'Erste', 'K&H', 'MBH', 'Bármely'],
      field: '[BANK] Preferált Bank'
    }
  ];

  // IMPORTANT PHASE Questions (20-30 min)
  const importantQuestions = [
    {
      id: 'employment_stability',
      question: '🟡 Munkahely stabilitása?',
      details: 'Meddig vannak biztos a jelenlegi bevételek?',
      options: ['2+ év', '6-24 hó', '<6 hó'],
      field: '[INC] Foglalkoztatási Stabilitás'
    },
    {
      id: 'income_verification',
      question: '🟡 Jövedemellenőrzés dokumentumai?',
      details: 'Bérszámfejtés, bevallás, bankszámla',
      options: ['Van', 'Részleges', 'Nincs'],
      field: '[DOCS] Jövedelem Ellenőrzés'
    },
    {
      id: 'property_docs',
      question: '🟡 Ingatlan dokumentumai?',
      details: 'Tulajdoni lap, térképmásolat, közművek',
      options: ['Teljes', 'Hiányos', 'Nem készült'],
      field: '[DOCS] Ingatlan Dokumentáció'
    },
    {
      id: 'signing_timeline',
      question: '🟡 Szerződés aláírási szándék?',
      details: 'Mikor szeretné aláírni?',
      options: ['Azonnali (1-2 hét)', 'Közeljövő (1-2 hó)', 'Későbbi (2+ hó)'],
      field: '[FIN] Szerződés Aláírási Szándék'
    },
    {
      id: 'additional_requirements',
      question: '🟡 Egyéb követelmények?',
      details: 'CSOK, babaváró, kamatcsökkentés',
      options: ['Igen, részletezz', 'Nem szükséges'],
      field: '[PROP] Speciális Programok'
    }
  ];

  // OPTIONAL PHASE Questions (15 min)
  const optionalQuestions = [
    {
      id: 'special_income',
      question: '🟢 Speciális jövedelem?',
      details: 'Osztalék, külföldi, készpénz?',
      field: '[INC] Speciális Jövedelem Típusai'
    },
    {
      id: 'business_details',
      question: '🟢 Vállalkozás részletei?',
      details: 'Iparág, méret, adózás',
      field: '[INC] Vállalkozási Jellemzők'
    },
    {
      id: 'insurance_interest',
      question: '🟢 Biztosítás érdeklődés?',
      details: 'Generali, MBH, egyéb?',
      field: '[PROP] Biztosítási Igények'
    }
  ];

  const getPhaseQuestions = () => {
    switch (currentPhase) {
      case 'critical':
        return criticalQuestions;
      case 'important':
        return importantQuestions;
      case 'optional':
        return optionalQuestions;
      default:
        return [];
    }
  };

  // Save data to Copper CRM
  const saveToCopperCRM = (fieldName, value) => {
    try {
      if (!window.CopperSdk) {
        console.log('ℹ️ Development mode - not saving to Copper:', { fieldName, value });
        return;
      }

      // Extract field ID from field name (e.g., "[CREDIT] KHR Status" → field ID)
      const updateData = {};
      updateData[fieldName] = value;
      
      console.log('💾 Saving to Copper:', { fieldName, value });
      
      // Copper SDK save - context-aware update
      if (window.CopperSdk.save) {
        window.CopperSdk.save(updateData);
      }
    } catch (error) {
      console.log('⚠️ Could not save to Copper:', error.message);
    }
  };

  const handleAnswer = (questionId, answer) => {
    // Find the field name for this question
    const allQuestions = [...criticalQuestions, ...importantQuestions, ...optionalQuestions];
    const question = allQuestions.find(q => q.id === questionId);
    
    // Update local state
    const newAnswers = {
      ...answers,
      [questionId]: answer
    };
    setAnswers(newAnswers);
    
    // Save to Copper immediately
    if (question?.field) {
      saveToCopperCRM(question.field, answer);
    }
  };

  const calculateQualification = () => {
    let score = 0;
    let issues = [];

    // KHR check
    if (answers.khr_status === 'Blokkolt') {
      issues.push('❌ KHR blokkolt - nem finanszírozható');
    } else if (answers.khr_status === 'Figyelmeztetés') {
      score -= 20;
      issues.push('⚠️ KHR figyelmeztetés - szigorúbb feltételek');
    }

    // Employment
    if (answers.employment === 'Saját vállalkozás') {
      score -= 15;
      issues.push('⚠️ Vállalkozás - szükséges 2+ év nyereség');
    }

    // Property type
    if (answers.property_type === 'Vályog') {
      score -= 25;
      issues.push('⚠️ Vályog ingatlan - korlátozott bank választék');
    } else if (answers.property_type === 'Tanya/Nyaraló') {
      score -= 30;
      issues.push('⚠️ Tanya/nyaraló - speciális elbírálás szükséges');
    }

    // JTM
    if (answers.jtm === '50%+') {
      score -= 25;
      issues.push('⚠️ Magas JTM - kamatcsökkentés szükséges');
    } else if (answers.jtm === '30-50%') {
      score += 10;
    } else {
      score += 20;
    }

    // Calculate decision
    let decision = 'GO';
    if (issues.some(i => i.includes('❌'))) {
      decision = 'NO-GO';
    } else if (score < 40) {
      decision = 'WAIT - Review Required';
    }

    const finalScore = Math.max(0, Math.min(100, 50 + score));

    const qualificationResult = {
      decision,
      score: finalScore,
      issues,
      completedQuestions: Object.keys(answers).length
    };

    setQualification(qualificationResult);

    // Save qualification result to Copper
    saveToCopperCRM('[BC] Minősítési Döntés', decision);
    saveToCopperCRM('[BC] Minősítési Pontszám', finalScore);
    saveToCopperCRM('[BC] Elbírálási Megjegyzések', issues.join(' | '));
  };

  const progressPercentage = (Object.keys(answers).length / getPhaseQuestions().length) * 100;

  if (loading) {
    return <div className="loading">⏳ Betöltés...</div>;
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>🏦 Ügyfél Minősítési Kérdőív</h1>
        <p className="customer-info">
          {copperContext?.data?.name || 'Új ügyfél'} | {copperContext?.entityType}
        </p>
      </header>

      <nav className="phase-selector">
        <button
          className={`phase-btn ${currentPhase === 'critical' ? 'active' : ''}`}
          onClick={() => setCurrentPhase('critical')}
        >
          🔴 Kritikus (3-5 min)
        </button>
        <button
          className={`phase-btn ${currentPhase === 'important' ? 'active' : ''}`}
          onClick={() => setCurrentPhase('important')}
        >
          🟡 Fontos (20-30 min)
        </button>
        <button
          className={`phase-btn ${currentPhase === 'optional' ? 'active' : ''}`}
          onClick={() => setCurrentPhase('optional')}
        >
          🟢 Opcionális (15 min)
        </button>
      </nav>

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        <span className="progress-text">{Math.round(progressPercentage)}% kitöltve</span>
      </div>

      <form className="questions-form">
        {getPhaseQuestions().map((q) => (
          <div key={q.id} className="question-block">
            <label className="question-label">{q.question}</label>
            {q.details && <p className="question-details">{q.details}</p>}
            <div className="options-grid">
              {q.options?.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`option-btn ${answers[q.id] === option ? 'selected' : ''}`}
                  onClick={() => handleAnswer(q.id, option)}
                >
                  {option}
                </button>
              ))}
            </div>
            <small className="field-reference">→ {q.field}</small>
          </div>
        ))}
      </form>

      <div className="action-buttons">
        <button
          className="btn-analyze"
          onClick={calculateQualification}
          disabled={Object.keys(answers).length === 0}
        >
          📊 Minősítés Elemzése
        </button>
      </div>

      {qualification && (
        <div className={`qualification-result ${qualification.decision.includes('GO') ? 'go' : qualification.decision.includes('NO') ? 'no-go' : 'wait'}`}>
          <h2>Minősítési Eredmény</h2>
          <div className="decision-badge">{qualification.decision}</div>
          <div className="score-circle">{qualification.score}/100</div>

          {qualification.issues.length > 0 && (
            <div className="issues-list">
              <h3>⚡ Problémák:</h3>
              <ul>
                {qualification.issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="button-group">
            <button className="btn-copy" onClick={() => {
              // Copy to clipboard for Copper notes
              const summary = `Minősítés: ${qualification.decision}\nPontszám: ${qualification.score}/100\nProblémák:\n${qualification.issues.join('\n')}`;
              navigator.clipboard.writeText(summary);
              alert('📋 Vágólapra másolva!');
            }}>
              📋 Másolás Vágólapra
            </button>
            <button className="btn-reset" onClick={() => {
              setAnswers({});
              setQualification(null);
            }}>
              🔄 Új Minősítés
            </button>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>2026 Copper CRM | Ügyfél Minősítési Rendszer v1.0</p>
      </footer>
    </div>
  );
}

export default App;
