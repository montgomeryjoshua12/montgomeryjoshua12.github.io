(() => {
  const system = document.querySelector('[data-story-system]');
  if (!system) return;

  const stages = [
    { kicker:'CONNECTED SOURCE', metric:'Sales +7.9%', source:'ERP · December close', title:'Connect the operating truth.', description:'Securely bring together the financial and operational systems that contain the signal—without changing how your team runs the business.', proof:'Documented source ownership', proofTwo:'Controlled data access' },
    { kicker:'GOVERNED METRIC', metric:'Sales +7.9%', source:'Definition v2.4 · Reconciled', title:'Make the number trustworthy.', description:'Apply consistent definitions, lineage, validation rules, and access controls so every user sees the same defensible measure.', proof:'Reconciled to source totals', proofTwo:'Transparent calculation logic' },
    { kicker:'ANALYST INTERPRETATION', metric:'Growth is accelerating', source:'Context · Materiality · Judgment', title:'Explain what changed and why it matters.', description:'The analyst tests the signal against operating context, separates noise from material change, and identifies the decision the business must make.', proof:'Business context applied', proofTwo:'Exceptions investigated' },
    { kicker:'DECISION-READY OUTPUT', metric:'Protect service capacity', source:'Dashboard · Forecast · Report', title:'Deliver intelligence in the operating rhythm.', description:'The validated signal becomes a live dashboard, forward-looking forecast, or month-end narrative—ready for the people accountable for action.', proof:'Role-specific delivery', proofTwo:'Automated, monitored refresh' }
  ];
  const buttons = [...system.querySelectorAll('[data-story]')];
  const fields = {
    kicker: system.querySelector('[data-story-kicker]'), metric: system.querySelector('[data-story-metric]'), source: system.querySelector('[data-story-source]'),
    number: system.querySelector('[data-story-number]'), title: system.querySelector('[data-story-title]'), description: system.querySelector('[data-story-description]'),
    proof: system.querySelector('[data-story-proof]'), proofTwo: system.querySelector('[data-story-proof-two]')
  };
  let active = 0;
  let timer;

  function select(index, userInitiated = false) {
    active = index;
    const stage = stages[index];
    buttons.forEach((button, i) => { button.classList.toggle('is-active', i === index); button.setAttribute('aria-selected', String(i === index)); });
    system.style.setProperty('--story-progress', `${(index / (stages.length - 1)) * 100}%`);
    system.querySelector('.story-stage')?.classList.remove('story-changing');
    requestAnimationFrame(() => system.querySelector('.story-stage')?.classList.add('story-changing'));
    fields.kicker.textContent = stage.kicker; fields.metric.textContent = stage.metric; fields.source.textContent = stage.source;
    fields.number.textContent = `STAGE 0${index + 1}`; fields.title.textContent = stage.title; fields.description.textContent = stage.description;
    fields.proof.textContent = stage.proof; fields.proofTwo.textContent = stage.proofTwo;
    if (userInitiated) restart();
  }
  function restart() {
    clearInterval(timer);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => select((active + 1) % stages.length), 5200);
  }
  buttons.forEach((button, index) => button.addEventListener('click', () => select(index, true)));
  select(0); restart();
})();
