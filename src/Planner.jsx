import { useState, useEffect, useCallback, useRef } from 'react'
import netlifyIdentity from 'netlify-identity-widget'

/* ─────────────────────────────── styles ─────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --cream: #F6F1EB; --warm: #EDE4D6; --brown: #2E1E14; --mid: #7A5C48;
    --soft: #C8B5A2; --white: #FFFDF9; --terra: #C4603A; --sage: #5E8A67;
    --blue: #3E7099; --gold: #BF8C2E; --lilac: #8B6FAE; --pink: #C4607A;
    --shadow: rgba(46,30,20,.10);
  }
  body { background: var(--cream); font-family: 'DM Sans', sans-serif; color: var(--brown); }
  .app { max-width: 980px; margin: 0 auto; padding: 28px 16px 60px; }
  .hdr { text-align: center; margin-bottom: 36px; }
  .hdr h1 { font-family: 'Playfair Display', serif; font-size: 2.4rem; font-weight: 700; letter-spacing: -.5px; }
  .hdr h1 em { font-style: italic; color: var(--terra); }
  .hdr p { color: var(--mid); font-size: .88rem; margin-top: 6px; font-weight: 300; }
  .hdr-meta { display: flex; align-items: center; justify-content: center; gap: 12px; margin-top: 8px; flex-wrap: wrap; }
  .sync-badge { font-size: .74rem; padding: 3px 10px; border-radius: 20px; font-weight: 500; }
  .sync-ok   { background: #EDF5EF; color: #5E8A67; }
  .sync-busy { background: #FBF5E9; color: #BF8C2E; }
  .sync-err  { background: #FAF0EB; color: #C4603A; }
  .logout-btn { font-size: .74rem; color: var(--soft); background: none; border: none; cursor: pointer; text-decoration: underline; }
  .tabs { display: flex; gap: 6px; justify-content: center; flex-wrap: wrap; margin-bottom: 28px; }
  .tab { padding: 8px 18px; border-radius: 40px; border: 1.5px solid var(--warm); background: var(--white); cursor: pointer; font-size: .84rem; font-weight: 500; color: var(--mid); transition: all .2s; }
  .tab.active { border-color: transparent; color: white; }
  .tab:hover:not(.active) { border-color: var(--soft); }
  .rail { display: flex; gap: 8px; margin-bottom: 32px; overflow-x: auto; padding-bottom: 4px; }
  .rail-month { flex: 1; min-width: 130px; background: var(--white); border-radius: 16px; padding: 14px 14px 12px; box-shadow: 0 2px 8px var(--shadow); cursor: pointer; border: 2px solid transparent; transition: all .2s; position: relative; }
  .rail-month.active { border-color: var(--terra); }
  .rail-month:hover:not(.active) { border-color: var(--soft); transform: translateY(-2px); }
  .rail-month .rm-num { font-size: .68rem; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; color: var(--soft); margin-bottom: 3px; }
  .rail-month .rm-name { font-family: 'Playfair Display', serif; font-size: 1rem; font-weight: 700; }
  .rail-month .rm-theme { font-size: .72rem; color: var(--mid); margin-top: 4px; line-height: 1.3; }
  .rail-month .rm-dots { display: flex; gap: 4px; margin-top: 8px; flex-wrap: wrap; }
  .rm-dot { width: 8px; height: 8px; border-radius: 50%; }
  .rm-prog { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; border-radius: 0 0 14px 14px; overflow: hidden; background: var(--warm); }
  .rm-prog-fill { height: 100%; border-radius: 0 0 14px 14px; transition: width .4s; }
  .month-view { animation: fadeUp .2s ease; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  .mv-header { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 20px; }
  .mv-badge { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; flex-shrink: 0; }
  .mv-header-text h2 { font-family: 'Playfair Display', serif; font-size: 1.5rem; }
  .mv-header-text .mv-tagline { font-size: .82rem; color: var(--mid); margin-top: 3px; line-height: 1.4; }
  .pillars { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 22px; }
  .pillar { background: var(--white); border-radius: 14px; padding: 12px 14px; box-shadow: 0 1px 6px var(--shadow); border-top: 3px solid; }
  .pillar .p-icon { font-size: 1.1rem; margin-bottom: 4px; }
  .pillar .p-cat { font-size: .68rem; font-weight: 600; letter-spacing: .4px; text-transform: uppercase; margin-bottom: 3px; }
  .pillar .p-goal { font-size: .8rem; color: var(--brown); line-height: 1.35; }
  .weeks { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
  .week-card { background: var(--white); border-radius: 16px; box-shadow: 0 1px 6px var(--shadow); overflow: hidden; }
  .week-header { display: flex; align-items: center; gap: 12px; padding: 14px 16px; cursor: pointer; user-select: none; }
  .week-header:hover { background: #faf7f3; }
  .week-num { font-size: .72rem; font-weight: 600; color: var(--soft); letter-spacing: .4px; text-transform: uppercase; min-width: 48px; }
  .week-title { font-family: 'Playfair Display', serif; font-size: 1rem; flex: 1; }
  .week-dates { font-size: .74rem; color: var(--soft); }
  .week-chevron { font-size: .8rem; color: var(--soft); transition: transform .2s; }
  .week-chevron.open { transform: rotate(180deg); }
  .week-tasks { padding: 0 16px 16px; display: flex; flex-direction: column; gap: 8px; }
  .task-row { display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; border-radius: 10px; cursor: pointer; transition: opacity .18s; user-select: none; }
  .task-row:hover { filter: brightness(.97); }
  .task-row.done { opacity: .45; }
  .task-row.done .tr-title { text-decoration: line-through; }
  .tr-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
  .tr-body { flex: 1; }
  .tr-cat { font-size: .65rem; font-weight: 600; letter-spacing: .4px; text-transform: uppercase; margin-bottom: 1px; }
  .tr-title { font-size: .86rem; font-weight: 500; color: var(--brown); }
  .tr-time { font-size: .72rem; color: var(--mid); margin-top: 2px; }
  .tr-check { font-size: .9rem; flex-shrink: 0; margin-top: 1px; }
  .mprog-row { display: flex; align-items: center; gap: 12px; padding: 14px 0 0; border-top: 1px solid var(--warm); }
  .mprog-label { font-size: .8rem; color: var(--mid); }
  .mprog-bar { flex: 1; height: 7px; background: var(--warm); border-radius: 4px; overflow: hidden; }
  .mprog-fill { height: 100%; border-radius: 4px; transition: width .4s; }
  .mprog-pct { font-size: .8rem; font-weight: 600; }
  .overview-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 24px; }
  .ov-stat { background: var(--white); border-radius: 16px; padding: 18px; text-align: center; box-shadow: 0 1px 6px var(--shadow); }
  .ov-num { font-family: 'Playfair Display', serif; font-size: 2rem; }
  .ov-lbl { font-size: .74rem; color: var(--mid); margin-top: 3px; font-weight: 500; }
  .roadmap { display: flex; flex-direction: column; }
  .rm-row { display: flex; align-items: stretch; }
  .rm-line { display: flex; flex-direction: column; align-items: center; width: 40px; flex-shrink: 0; }
  .rm-circle { width: 18px; height: 18px; border-radius: 50%; border: 2.5px solid; flex-shrink: 0; }
  .rm-vline { flex: 1; width: 2px; background: var(--warm); }
  .rm-content { flex: 1; padding: 0 0 24px 12px; }
  .rm-content h4 { font-family: 'Playfair Display', serif; font-size: 1rem; margin-bottom: 6px; }
  .rm-content ul { list-style: none; display: flex; flex-direction: column; gap: 5px; }
  .rm-content li { font-size: .8rem; color: var(--mid); display: flex; align-items: flex-start; gap: 6px; line-height: 1.4; }
  .rm-content li::before { content: '→'; color: var(--soft); flex-shrink: 0; }
  .rm-tag { display: inline-block; font-size: .65rem; font-weight: 600; letter-spacing: .4px; text-transform: uppercase; padding: 2px 8px; border-radius: 20px; color: white; margin-bottom: 6px; }
  .rest-box { background: var(--white); border-radius: 16px; padding: 20px; box-shadow: 0 1px 6px var(--shadow); margin-bottom: 24px; }
  .rest-box h3 { font-family: 'Playfair Display', serif; font-size: 1.1rem; margin-bottom: 14px; }
  .rest-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; }
  .rest-item { text-align: center; padding: 10px 8px; }
  .rest-item .ri-icon { font-size: 1.5rem; margin-bottom: 4px; }
  .rest-item .ri-title { font-size: .78rem; font-weight: 600; color: var(--brown); }
  .rest-item .ri-desc { font-size: .7rem; color: var(--mid); margin-top: 2px; line-height: 1.3; }
  @media (max-width: 620px) {
    .pillars { grid-template-columns: repeat(2,1fr); }
    .overview-grid { grid-template-columns: repeat(2,1fr); }
    .rest-grid { grid-template-columns: repeat(2,1fr); }
    .hdr h1 { font-size: 1.9rem; }
    .rail { gap: 6px; }
    .rail-month { min-width: 110px; }
  }
`

/* ─────────────────────────────── data ─────────────────────────────── */
const CAT = {
  toefl:   { label: 'TOEFL',    color: '#3E7099', bg: '#EBF3F9', icon: '📖' },
  job:     { label: '求職',     color: '#C4603A', bg: '#FAF0EB', icon: '💼' },
  school:  { label: '留學申請', color: '#BF8C2E', bg: '#FBF5E9', icon: '🎓' },
  lightup: { label: 'LightUp',  color: '#7A5C48', bg: '#F3EDE8', icon: '💡' },
  rest:    { label: '休息',     color: '#5E8A67', bg: '#EDF5EF', icon: '🌿' },
  prep:    { label: '申請衝刺', color: '#8B6FAE', bg: '#F3EFF8', icon: '✍️' },
}

const MONTHS = [
  { id:0, label:'四月', en:'April',     emoji:'🌱', color:'#5E8A67', tagline:'打基礎・診斷測試・整理方向',          bgColor:'#EDF5EF',
    pillars:[{cat:'toefl',goal:'診斷測試，找出弱點，制定備考策略'},{cat:'job',goal:'整理履歷、研究目標公司、開始投遞'},{cat:'school',goal:'列出 6-8 所目標學校，研究申請要求'},{cat:'rest',goal:'週日全休，每天留 1 個興趣時段'}],
    weeks:[
      {title:'診斷 + 定位',dates:'4/1–4/7',tasks:[{cat:'toefl',title:'TOEFL 診斷模考（閱讀+聽力）',time:'2h'},{cat:'toefl',title:'分析弱點，建立備考時間表',time:'45min'},{cat:'job',title:'更新 LinkedIn、整理過去成就清單',time:'1h'},{cat:'school',title:'初步列出目標學校清單（6所）',time:'1h'},{cat:'lightup',title:'LightUp：建立求職 + 留學任務板',time:'30min'},{cat:'rest',title:'週末：追劇+編織，完全不碰正事',time:'自由'}]},
      {title:'建立習慣',dates:'4/8–4/14',tasks:[{cat:'toefl',title:'每日單字 20 個（Academic Word List）',time:'30min/天'},{cat:'toefl',title:'TPO 閱讀精讀，每週 3 篇',time:'45min/篇'},{cat:'job',title:'研究 3 間目標公司文化 + JD 分析',time:'1h'},{cat:'school',title:'深入研究 2 所學校課程 + 聯絡推薦人',time:'1h'},{cat:'lightup',title:'LightUp：加入一本英文備考書',time:'20min'},{cat:'rest',title:'找朋友吃飯或音樂放鬆一次',time:'自由'}]},
      {title:'開始輸出',dates:'4/15–4/21',tasks:[{cat:'toefl',title:'聽力練習：每天一段 lecture + 筆記',time:'40min'},{cat:'toefl',title:'口說 Task 1-2 錄音練習',time:'30min'},{cat:'job',title:'寫第一份英文求職信草稿',time:'1h'},{cat:'job',title:'投遞第 1-2 份工作',time:'45min'},{cat:'school',title:'開始寫 SOP：Why this field（200字）',time:'1h'},{cat:'rest',title:'看一部想看很久的電影',time:'自由'}]},
      {title:'回顧 + 調整',dates:'4/22–4/30',tasks:[{cat:'toefl',title:'寫作：Integrated Task 練習 2 篇',time:'1h'},{cat:'job',title:'投遞第 3 份工作，整理求職追蹤表',time:'45min'},{cat:'school',title:'整理申請 Deadline 總表',time:'45min'},{cat:'lightup',title:'LightUp：月度回顧，更新任務',time:'30min'},{cat:'rest',title:'犒賞自己：週末完全充電',time:'自由'}]},
    ],
  },
  { id:1, label:'五月', en:'May',       emoji:'📚', color:'#3E7099', tagline:'TOEFL 衝刺・求職深化・SOP 雛形',       bgColor:'#EBF3F9',
    pillars:[{cat:'toefl',goal:'完成 6 套 TPO 模擬，目標成績 90+ 分'},{cat:'job',goal:'每週投 2-3 份，練習 Mock Interview'},{cat:'school',goal:'SOP 第一完整版，確認推薦人 2-3 位'},{cat:'rest',goal:'固定每週社交日、樂器練習時間'}],
    weeks:[
      {title:'閱讀+聽力強化',dates:'5/1–5/7',tasks:[{cat:'toefl',title:'TPO 閱讀模擬：2 套完整練習',time:'2h'},{cat:'toefl',title:'聽力分類練習：學術類 + 校園類',time:'1h'},{cat:'job',title:'Mock Interview：STAR 法則練習 3 題',time:'1h'},{cat:'school',title:'SOP：過去經歷段落完成',time:'1h'},{cat:'lightup',title:'LightUp：更新書單進度',time:'20min'},{cat:'rest',title:'五一連假：安排一次朋友聚會',time:'自由'}]},
      {title:'口說 + 寫作突破',dates:'5/8–5/14',tasks:[{cat:'toefl',title:'口說每天錄音，Task 3-4 練習',time:'30min'},{cat:'toefl',title:'寫作 Independent Task：計時練習 2 篇',time:'1.5h'},{cat:'job',title:'投遞工作 2-3 份，追蹤回應狀況',time:'1h'},{cat:'school',title:'SOP：未來目標 + 為何選此校 段落',time:'1.5h'},{cat:'rest',title:'練樂器 15 分鐘，不求完美',time:'自由'}]},
      {title:'全真模擬考',dates:'5/15–5/21',tasks:[{cat:'toefl',title:'全真 TPO 模擬考（4 科完整版）',time:'4h'},{cat:'toefl',title:'模考對答 + 弱點分析筆記',time:'1.5h'},{cat:'job',title:'更新履歷，加入新專案成果',time:'1h'},{cat:'school',title:'SOP 第一完整版完成，請友人 review',time:'2h'},{cat:'rest',title:'看完一部追很久的劇集結局',time:'自由'}]},
      {title:'鞏固 + 計劃六月',dates:'5/22–5/31',tasks:[{cat:'toefl',title:'針對弱項加強練習 + 單字衝刺',time:'1h/天'},{cat:'job',title:'整理求職進度，分析回應率',time:'45min'},{cat:'school',title:'確認推薦人名單，準備推薦信 template',time:'1h'},{cat:'lightup',title:'LightUp：月度回顧',time:'30min'},{cat:'rest',title:'出門走走：換個環境充電',time:'自由'}]},
    ],
  },
  { id:2, label:'六月', en:'June',      emoji:'🎯', color:'#BF8C2E', tagline:'TOEFL 考試月・求職面試・材料整備',      bgColor:'#FBF5E9',
    pillars:[{cat:'toefl',goal:'安排並完成 TOEFL 考試，目標 90-100 分'},{cat:'job',goal:'爭取面試機會，準備 case study'},{cat:'school',goal:'整備申請材料，SOP 第二版修改'},{cat:'rest',goal:'考前最後一週降壓，考後好好慶祝'}],
    weeks:[
      {title:'考前衝刺',dates:'6/1–6/7',tasks:[{cat:'toefl',title:'每天 1.5-2h 高強度複習',time:'每天'},{cat:'toefl',title:'口說+寫作：最後批改練習',time:'1h'},{cat:'job',title:'研究目標公司最新新聞，準備面試話題',time:'45min'},{cat:'school',title:'整理成績單、在職證明等基礎文件',time:'1h'},{cat:'rest',title:'每天固定一個解壓活動（不可省略）',time:'30min'}]},
      {title:'🎯 TOEFL 考試週',dates:'6/8–6/14',tasks:[{cat:'toefl',title:'輕度複習，保持狀態，早睡',time:'1h'},{cat:'toefl',title:'📌 TOEFL 考試日！',time:'全天'},{cat:'rest',title:'考後：跟朋友慶祝，完全放假 2-3 天',time:'自由'},{cat:'job',title:'投遞工作 1-2 份（輕量）',time:'45min'}]},
      {title:'考後重建節奏',dates:'6/15–6/21',tasks:[{cat:'school',title:'SOP 第二版：根據各校特色客製化',time:'2h'},{cat:'job',title:'如有面試邀約：準備 case + 練習',time:'2h'},{cat:'school',title:'給推薦人寄送資料 + 截止日提醒',time:'1h'},{cat:'lightup',title:'LightUp：加入申請材料 checklist',time:'30min'},{cat:'rest',title:'編織放鬆，看一部喜歡的電影',time:'自由'}]},
      {title:'材料盤點',dates:'6/22–6/30',tasks:[{cat:'school',title:'成績單、財力證明等文件確認完整',time:'1h'},{cat:'school',title:'每所學校申請清單逐一確認',time:'1.5h'},{cat:'job',title:'面試跟進/感謝信，維持求職進度',time:'45min'},{cat:'lightup',title:'LightUp：月度大回顧 + 七八月計劃',time:'30min'},{cat:'rest',title:'夏至：犒賞自己完成考試的好好慶祝',time:'自由'}]},
    ],
  },
  { id:3, label:'七月', en:'July',      emoji:'✍️', color:'#8B6FAE', tagline:'SOP 精修・文書撰寫・求職持續',           bgColor:'#F3EFF8',
    pillars:[{cat:'prep',goal:'每所學校 SOP 個性化版本完成'},{cat:'job',goal:'求職持續，若 TOEFL 未達目標可補考'},{cat:'school',goal:'CV、成績單、推薦信進度確認'},{cat:'rest',goal:'暑熱中維持節奏，每週安排出遊'}],
    weeks:[
      {title:'SOP 工廠週 I',dates:'7/1–7/7',tasks:[{cat:'prep',title:'SOP A校：針對課程特色修改完成',time:'2h'},{cat:'prep',title:'SOP B校：Why this school 段落客製化',time:'2h'},{cat:'job',title:'投遞工作 2 份，更新求職進度表',time:'1h'},{cat:'school',title:'追蹤推薦信進度，必要時提醒推薦人',time:'30min'},{cat:'rest',title:'找朋友出遊一天充電',time:'自由'}]},
      {title:'SOP 工廠週 II',dates:'7/8–7/14',tasks:[{cat:'prep',title:'SOP C+D 校完成，請人 review',time:'3h'},{cat:'school',title:'Essay 題目分析（各校 short answers）',time:'2h'},{cat:'job',title:'面試準備：Technical/Behavioural 練習',time:'1.5h'},{cat:'lightup',title:'LightUp：整理申請進度 dashboard',time:'30min'},{cat:'rest',title:'音樂放鬆：花時間練習一首喜歡的曲',time:'自由'}]},
      {title:'文件衝刺',dates:'7/15–7/21',tasks:[{cat:'prep',title:'SOP E+F 校完成（完成 6 所）',time:'3h'},{cat:'school',title:'CV 英文版最終確認',time:'1h'},{cat:'school',title:'Short essays/additional questions 初稿',time:'2h'},{cat:'job',title:'求職面試一輪（如有）',time:'視情況'},{cat:'rest',title:'看完一本閱讀清單裡的書',time:'自由'}]},
      {title:'全面審稿',dates:'7/22–7/31',tasks:[{cat:'prep',title:'所有 SOP 最終版完成，外部 proofreading',time:'2h'},{cat:'school',title:'各校申請平台帳號建立，資料預填',time:'1.5h'},{cat:'job',title:'如有 offer 討論，開始評估',time:'視情況'},{cat:'lightup',title:'LightUp：月度回顧，整理八月目標',time:'30min'},{cat:'rest',title:'月末放假：追劇+朋友聚會+完全不工作',time:'自由'}]},
    ],
  },
  { id:4, label:'八月', en:'August',    emoji:'🚀', color:'#C4603A', tagline:'申請材料完備・最後確認・蓄勢待發',       bgColor:'#FAF0EB',
    pillars:[{cat:'prep',goal:'所有文件 100% 完成，反覆審閱無錯誤'},{cat:'school',goal:'9 月送件準備，各校系統完整填寫'},{cat:'job',goal:'求職並行，維持投遞節奏'},{cat:'rest',goal:'申請前最後喘息，安排一次小旅行'}],
    weeks:[
      {title:'文件最終版',dates:'8/1–8/7',tasks:[{cat:'prep',title:'所有 SOP 最後一輪校對（找信賴的人 review）',time:'2h'},{cat:'school',title:'Short answers / essays 最終版完成',time:'2h'},{cat:'school',title:'確認推薦信已完成或追蹤進度',time:'30min'},{cat:'job',title:'求職：投遞 2-3 份，維持曝光',time:'1h'},{cat:'rest',title:'安排出遊或小旅行計劃（八月假期）',time:'自由'}]},
      {title:'系統填寫',dates:'8/8–8/14',tasks:[{cat:'school',title:'各校申請系統：逐校填寫個人資料',time:'3h'},{cat:'school',title:'上傳文件：成績單、CV、語言成績',time:'1.5h'},{cat:'prep',title:'SOP 貼入各校系統，格式確認',time:'1h'},{cat:'lightup',title:'LightUp：建立申請送件進度表',time:'30min'},{cat:'rest',title:'找朋友出去放空，不談申請',time:'自由'}]},
      {title:'全面審查',dates:'8/15–8/21',tasks:[{cat:'school',title:'逐校審查所有填寫內容，挑錯',time:'2h'},{cat:'school',title:'費用/支付方式確認，備好信用卡',time:'30min'},{cat:'prep',title:'準備 Interview 常見問題（部分學校有面試）',time:'1.5h'},{cat:'job',title:'求職追蹤，回覆任何未讀 email',time:'45min'},{cat:'rest',title:'月中放鬆週：多點音樂和追劇',time:'自由'}]},
      {title:'備戰九月',dates:'8/22–8/31',tasks:[{cat:'school',title:'9 月送件最後演練：模擬送出流程',time:'1h'},{cat:'school',title:'緊急 backup plan 確認（保底學校）',time:'1h'},{cat:'prep',title:'心理準備：接受不確定，擁抱過程',time:'30min'},{cat:'lightup',title:'LightUp：半年回顧，記錄成長',time:'45min'},{cat:'rest',title:'✨ 犒賞自己：完成半年計劃的慶祝日',time:'自由'}]},
    ],
  },
  { id:5, label:'九月', en:'September', emoji:'🎓', color:'#C4607A', tagline:'🎉 申請送出！迎接新的可能',               bgColor:'#FBF0F3',
    pillars:[{cat:'prep',goal:'陸續送出申請，先截止的學校優先'},{cat:'job',goal:'求職持續，與申請並行，不偏廢'},{cat:'school',goal:'等待期間關注各校通知，準備面試'},{cat:'rest',goal:'送出後好好放鬆，不要過度焦慮'}],
    weeks:[
      {title:'🚀 開始送件',dates:'9/1–9/7',tasks:[{cat:'prep',title:'送出第一所學校申請！',time:'全力以赴'},{cat:'prep',title:'確認系統收到 + 截圖存証',time:'20min'},{cat:'job',title:'求職並行：投遞 2 份',time:'1h'},{cat:'lightup',title:'LightUp：記錄送件日期和狀態',time:'20min'},{cat:'rest',title:'送件慶祝！跟朋友吃大餐',time:'自由'}]},
      {title:'持續推進',dates:'9/8–9/14',tasks:[{cat:'prep',title:'送出第 2-3 所學校',time:'2h'},{cat:'prep',title:'追蹤推薦信是否都已送達',time:'30min'},{cat:'job',title:'求職面試準備（如有邀約）',time:'2h'},{cat:'rest',title:'開始一個新的興趣活動（編織新作品）',time:'自由'}]},
      {title:'全面送出',dates:'9/15–9/21',tasks:[{cat:'prep',title:'完成所有學校申請送出',time:'視情況'},{cat:'prep',title:'整理所有送件確認郵件',time:'30min'},{cat:'school',title:'部分學校面試邀約：準備 + 練習',time:'2h'},{cat:'job',title:'求職進度更新，繼續投遞',time:'1h'},{cat:'rest',title:'放下焦慮：去看場電影或出遊',time:'自由'}]},
      {title:'等待 + 展望',dates:'9/22–9/30',tasks:[{cat:'prep',title:'若有 Interview 邀約：全力準備',time:'2h/次'},{cat:'school',title:'開始研究獎學金申請（部分有額外表格）',time:'1h'},{cat:'job',title:'求職：持續投遞，保持可能性',time:'1h'},{cat:'lightup',title:'LightUp：半年旅程完整回顧記錄',time:'1h'},{cat:'rest',title:'✨ 你做到了！好好慶祝、好好休息',time:'自由'}]},
    ],
  },
]

function makeDoneState() {
  const s = {}
  MONTHS.forEach((m, mi) => m.weeks.forEach((w, wi) => w.tasks.forEach((_, ti) => { s[`${mi}-${wi}-${ti}`] = false })))
  return s
}

/* ─────────────────────────────── Planner ─────────────────────────────── */
// Helper: get Netlify Identity JWT token for authenticated requests
async function getAuthHeaders() {
  const user = netlifyIdentity.currentUser()
  if (!user) return {}
  // Refresh token if needed
  await user.jwt(true)
  return { Authorization: `Bearer ${user.token.access_token}` }
}

export default function Planner({ user }) {
  const [activeTab, setActiveTab]     = useState('overview')
  const [activeMonth, setActiveMonth] = useState(0)
  const [openWeeks, setOpenWeeks]     = useState({ 0: true })
  const [done, setDone]               = useState(makeDoneState)
  const [syncStatus, setSyncStatus]   = useState('ok') // ok | busy | err
  const debounceRef = useRef(null)

  // Load from Neon via Netlify Function on mount
  useEffect(() => {
    const load = async () => {
      setSyncStatus('busy')
      try {
        const headers = await getAuthHeaders()
        const res = await fetch('/api/progress', { headers })
        if (!res.ok) throw new Error(await res.text())
        const { done_state } = await res.json()
        if (done_state && Object.keys(done_state).length > 0) {
          setDone(prev => ({ ...prev, ...done_state }))
        }
        setSyncStatus('ok')
      } catch (e) {
        console.error('Load error:', e)
        setSyncStatus('err')
      }
    }
    load()
  }, [user.email])

  // Debounced save to Neon via Netlify Function
  const saveToNeon = useCallback(async (newDone) => {
    setSyncStatus('busy')
    try {
      const headers = await getAuthHeaders()
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ done_state: newDone }),
      })
      setSyncStatus(res.ok ? 'ok' : 'err')
    } catch (e) {
      console.error('Save error:', e)
      setSyncStatus('err')
    }
  }, [user.email])

  const toggleTask = (mi, wi, ti) => {
    const key = `${mi}-${wi}-${ti}`
    const nd = { ...done, [key]: !done[key] }
    setDone(nd)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => saveToNeon(nd), 1200)
  }

  const toggleWeek = (wi) => setOpenWeeks(p => ({ ...p, [wi]: !p[wi] }))

  const monthProgress = (mi) => {
    const m = MONTHS[mi]
    const total = m.weeks.reduce((a, w) => a + w.tasks.length, 0)
    const d     = m.weeks.reduce((a, w, wi) => a + w.tasks.filter((_, ti) => done[`${mi}-${wi}-${ti}`]).length, 0)
    return total === 0 ? 0 : d / total
  }

  const totalDone = Object.values(done).filter(Boolean).length
  const totalAll  = Object.values(done).length
  const m = MONTHS[activeMonth]

  const syncLabel = { ok: '✓ 已同步', busy: '⟳ 同步中...', err: '✕ 同步失敗' }
  const syncClass = { ok: 'sync-ok', busy: 'sync-busy', err: 'sync-err' }

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* Header */}
        <div className="hdr">
          <h1>六個月計劃 <em>April → September</em></h1>
          <p>TOEFL 備考 · 海外求職 · 九月送出留學申請 · 好好休息</p>
          <div className="hdr-meta">
            <span className={`sync-badge ${syncClass[syncStatus]}`}>{syncLabel[syncStatus]}</span>
            <span style={{ fontSize: '.74rem', color: 'var(--soft)' }}>{user.email}</span>
            <button className="logout-btn" onClick={() => netlifyIdentity.logout()}>登出</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {[['overview','📋 六月全覽'],...MONTHS.map((mo,i)=>[`m${i}`,`${mo.emoji} ${mo.label}`])].map(([id,lbl],idx)=>{
            const isActive = id === 'overview' ? activeTab==='overview' : activeTab==='month' && activeMonth===idx-1
            const color = id === 'overview' ? '#5E8A67' : MONTHS[idx-1]?.color
            return (
              <div key={id} className={`tab${isActive?' active':''}`}
                style={isActive?{background:color}:{}}
                onClick={()=>{ if(id==='overview'){setActiveTab('overview')}else{setActiveTab('month');setActiveMonth(idx-1);setOpenWeeks({0:true})} }}>
                {lbl}
              </div>
            )
          })}
        </div>

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <div className="month-view">
            <div className="overview-grid">
              <div className="ov-stat"><div className="ov-num" style={{color:'#5E8A67'}}>{totalDone}</div><div className="ov-lbl">已完成任務</div></div>
              <div className="ov-stat"><div className="ov-num" style={{color:'#C4603A'}}>{Math.round(totalDone/totalAll*100)}%</div><div className="ov-lbl">整體進度</div></div>
              <div className="ov-stat"><div className="ov-num" style={{color:'#8B6FAE'}}>6</div><div className="ov-lbl">申請目標學校</div></div>
            </div>

            <div className="rail">
              {MONTHS.map((mo,i)=>{
                const prog=monthProgress(i)
                return (
                  <div key={i} className={`rail-month${activeTab==='month'&&activeMonth===i?' active':''}`}
                    onClick={()=>{setActiveTab('month');setActiveMonth(i);setOpenWeeks({0:true})}}>
                    <div className="rm-num">{mo.en}</div>
                    <div className="rm-name">{mo.emoji} {mo.label}</div>
                    <div className="rm-theme">{mo.tagline}</div>
                    <div className="rm-dots">{mo.pillars.map((p,pi)=><div key={pi} className="rm-dot" style={{background:CAT[p.cat].color}}/>)}</div>
                    <div className="rm-prog"><div className="rm-prog-fill" style={{width:`${prog*100}%`,background:mo.color}}/></div>
                  </div>
                )
              })}
            </div>

            <div style={{background:'var(--white)',borderRadius:20,padding:'24px 20px',boxShadow:'0 2px 12px var(--shadow)',marginBottom:24}}>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',marginBottom:20}}>六個月里程碑</h3>
              <div className="roadmap">
                {[
                  {mo:MONTHS[0],bullets:['TOEFL 診斷測試，制定備考策略','整理目標學校清單 6 所','履歷更新，開始投遞求職','建立每日習慣節奏']},
                  {mo:MONTHS[1],bullets:['TOEFL 全真模考，目標 90+ 分策略','SOP 第一完整版完成','確認 2-3 位推薦人意願','求職 Mock Interview 練習']},
                  {mo:MONTHS[2],bullets:['📌 完成 TOEFL 正式考試','SOP 第二版：各校客製化版本','文件清單全部備齊','考後好好慶祝休息']},
                  {mo:MONTHS[3],bullets:['所有學校 SOP 個性化版本完成','Short essays / 附加問題完成','英文 CV 最終確認','各校申請平台帳號建立']},
                  {mo:MONTHS[4],bullets:['所有申請文件 100% 完成','各校系統逐校填寫完畢','推薦信全數確認收到','✨ 申請前犒賞自己小旅行']},
                  {mo:MONTHS[5],bullets:['🎉 陸續送出所有申請！','確認各校收件，追蹤狀態','若有 Interview 邀約：全力準備','求職持續並行，迎接新可能']},
                ].map(({mo,bullets},i)=>(
                  <div key={i} className="rm-row">
                    <div className="rm-line">
                      <div className="rm-circle" style={{borderColor:mo.color,background:monthProgress(i)>0.5?mo.color:'white'}}/>
                      {i<5&&<div className="rm-vline"/>}
                    </div>
                    <div className="rm-content">
                      <div className="rm-tag" style={{background:mo.color}}>{mo.emoji} {mo.label}</div>
                      <h4>{mo.tagline}</h4>
                      <ul>{bullets.map((b,bi)=><li key={bi}>{b}</li>)}</ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rest-box">
              <h3>🌿 休息原則（整個半年都適用）</h3>
              <div className="rest-grid">
                {[{icon:'📺',title:'追劇/電影',desc:'每週至少一次，不帶罪惡感'},{icon:'🎵',title:'音樂/樂器',desc:'每天 15 分鐘，不求進度'},{icon:'🧶',title:'編織',desc:'壓力大時最好的手作放鬆'},{icon:'📚',title:'閱讀（非考試）',desc:'睡前 20 分鐘閒書'},{icon:'👫',title:'社交聚會',desc:'每週至少一次朋友連結'},{icon:'☀️',title:'週日全休',desc:'一週一天，不看任何任務'}].map((r,i)=>(
                  <div key={i} className="rest-item">
                    <div className="ri-icon">{r.icon}</div>
                    <div className="ri-title">{r.title}</div>
                    <div className="ri-desc">{r.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Month view ── */}
        {activeTab === 'month' && (
          <div className="month-view">
            <div className="mv-header">
              <div className="mv-badge" style={{background:m.bgColor,fontSize:'1.8rem'}}>{m.emoji}</div>
              <div className="mv-header-text">
                <h2 style={{color:m.color}}>{m.label}（{m.en}）— {m.tagline}</h2>
                <div className="mv-tagline">點擊週標題展開任務 · 點擊任務完成打勾</div>
              </div>
            </div>

            <div className="pillars">
              {m.pillars.map((p,i)=>(
                <div key={i} className="pillar" style={{borderTopColor:CAT[p.cat].color,background:CAT[p.cat].bg}}>
                  <div className="p-icon">{CAT[p.cat].icon}</div>
                  <div className="p-cat" style={{color:CAT[p.cat].color}}>{CAT[p.cat].label}</div>
                  <div className="p-goal">{p.goal}</div>
                </div>
              ))}
            </div>

            <div className="weeks">
              {m.weeks.map((w,wi)=>{
                const isOpen = !!openWeeks[wi]
                const wDone = w.tasks.filter((_,ti)=>done[`${activeMonth}-${wi}-${ti}`]).length
                return (
                  <div key={wi} className="week-card">
                    <div className="week-header" onClick={()=>toggleWeek(wi)}>
                      <div className="week-num">Week {wi+1}</div>
                      <div className="week-title">{w.title}</div>
                      <div className="week-dates">{w.dates}</div>
                      <div style={{fontSize:'.75rem',color:m.color,fontWeight:600,minWidth:40,textAlign:'right'}}>{wDone}/{w.tasks.length}</div>
                      <div className={`week-chevron${isOpen?' open':''}`}>▼</div>
                    </div>
                    {isOpen && (
                      <div className="week-tasks">
                        {w.tasks.map((t,ti)=>{
                          const key=`${activeMonth}-${wi}-${ti}`
                          const isDone=done[key]
                          const c=CAT[t.cat]
                          return (
                            <div key={ti} className={`task-row${isDone?' done':''}`} style={{background:c.bg}} onClick={()=>toggleTask(activeMonth,wi,ti)}>
                              <div className="tr-icon">{c.icon}</div>
                              <div className="tr-body">
                                <div className="tr-cat" style={{color:c.color}}>{c.label}</div>
                                <div className="tr-title">{t.title}</div>
                                <div className="tr-time">⏱ {t.time}</div>
                              </div>
                              <div className="tr-check">{isDone?'✅':'⬜'}</div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="mprog-row">
              <div className="mprog-label">{m.label} 進度</div>
              <div className="mprog-bar"><div className="mprog-fill" style={{width:`${monthProgress(activeMonth)*100}%`,background:m.color}}/></div>
              <div className="mprog-pct" style={{color:m.color}}>{Math.round(monthProgress(activeMonth)*100)}%</div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
