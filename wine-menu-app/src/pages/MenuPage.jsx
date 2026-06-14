import { useState } from 'react'

export const CAT_STYLE = {
  '伏特加': { gradient: 'linear-gradient(135deg,#667eea,#764ba2)', emoji: '🧊' },
  '金酒':   { gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', emoji: '🌿' },
  '朗姆':   { gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', emoji: '🌊' },
  '龙舌兰': { gradient: 'linear-gradient(135deg,#43e97b,#38f9d7)', emoji: '🌵' },
  '威士忌': { gradient: 'linear-gradient(135deg,#fa709a,#fee140)', emoji: '🥃' },
  '特调':   { gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)', emoji: '✨' },
}

export default function MenuPage({ wines, categories, onOrder }) {
  const [cat, setCat] = useState(categories[0])
  const [detail, setDetail] = useState(null)

  const list = wines.filter(w => w.category === cat)
  const s = CAT_STYLE[cat] || {}

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🍸 精品酒单</h1>
        <p className="page-sub">探索我们的精选鸡尾酒</p>
      </div>

      <div className="cat-tabs">
        {categories.map(c => (
          <button key={c} className={`cat-tab ${cat === c ? 'active' : ''}`}
            style={cat === c ? { background: CAT_STYLE[c]?.gradient } : {}}
            onClick={() => setCat(c)}>
            {CAT_STYLE[c]?.emoji} {c}
          </button>
        ))}
      </div>

      {list.length === 0
        ? <div className="empty">该分类暂无酒品<br />请在「管理酒单」中添加</div>
        : <div className="wine-grid">
            {list.map(w => (
              <div key={w.id} className="wine-card" onClick={() => setDetail(w)}>
                <div className="wine-img" style={{ background: s.gradient }}>
                  {w.image ? <img src={w.image} alt={w.name} /> : <span className="wine-emoji">{CAT_STYLE[w.category]?.emoji}</span>}
                </div>
                <div className="wine-body">
                  <h3>{w.name}</h3>
                  <p className="wine-desc">{w.description}</p>
                  <div className="wine-foot">
                    <span className="price">¥{w.price}</span>
                    <span className="sales">销量 {w.sales || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
      }

      {detail && (
        <div className="modal-bg" onClick={() => setDetail(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-x" onClick={() => setDetail(null)}>✕</button>
            <div className="modal-img" style={{ background: CAT_STYLE[detail.category]?.gradient }}>
              {detail.image ? <img src={detail.image} alt={detail.name} /> : <span>{CAT_STYLE[detail.category]?.emoji}</span>}
            </div>
            <div className="modal-body">
              <h2>{detail.name}</h2>
              <p className="modal-cat">{detail.category}</p>
              <p className="modal-desc">{detail.description}</p>
              {detail.steps && (
                <div className="modal-steps">
                  <h4>🔬 制作步骤</h4>
                  <pre>{detail.steps}</pre>
                </div>
              )}
              <div className="modal-foot">
                <span className="price big">¥{detail.price}</span>
                <button className="btn-pink" onClick={() => { setDetail(null); onOrder() }}>立即点单</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
