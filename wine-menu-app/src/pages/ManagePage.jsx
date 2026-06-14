import { useState, useRef } from 'react'
import { CAT_STYLE } from './MenuPage'

const BLANK = { name: '', category: '伏特加', price: '', description: '', steps: '', image: null }

const compress = (file) => new Promise(resolve => {
  const reader = new FileReader()
  reader.onloadend = () => {
    const img = new Image()
    img.onload = () => {
      const MAX = 600
      let w = img.width, h = img.height
      if (w > MAX) { h = (MAX / w) * h; w = MAX }
      if (h > MAX) { w = (MAX / h) * w; h = MAX }
      const c = document.createElement('canvas')
      c.width = w; c.height = h
      c.getContext('2d').drawImage(img, 0, 0, w, h)
      resolve(c.toDataURL('image/jpeg', 0.72))
    }
    img.src = reader.result
  }
  reader.readAsDataURL(file)
})

export default function ManagePage({ wines, setWines, categories }) {
  const [form, setForm] = useState(BLANK)
  const [editId, setEditId] = useState(null)
  const [cat, setCat] = useState(categories[0])
  const fileRef = useRef()

  const list = wines.filter(w => w.category === cat)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleImg = async (e) => {
    const f = e.target.files[0]
    if (f) set('image', await compress(f))
  }

  const save = () => {
    if (!form.name.trim()) return alert('请输入酒品名称')
    if (!form.price) return alert('请输入价格')
    if (editId) {
      setWines(p => p.map(w => w.id === editId ? { ...w, ...form } : w))
      setEditId(null)
    } else {
      setWines(p => [...p, { id: Date.now().toString(), ...form, sales: 0 }])
    }
    setForm(BLANK)
    if (fileRef.current) fileRef.current.value = ''
  }

  const startEdit = (w) => {
    setEditId(w.id)
    setForm({ name: w.name, category: w.category, price: w.price, description: w.description || '', steps: w.steps || '', image: w.image || null })
    setCat(w.category)
  }

  const cancel = () => { setEditId(null); setForm(BLANK); if (fileRef.current) fileRef.current.value = '' }

  const del = (id) => { if (confirm('确定删除？')) setWines(p => p.filter(w => w.id !== id)) }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">⚙️ 管理酒单</h1>
        <p className="page-sub">{editId ? '编辑酒品信息' : '添加新酒品到酒单'}</p>
      </div>

      <div className="manage-layout">
        <div className="manage-form-box">
          <h2 className="form-title">{editId ? '✏️ 编辑酒品' : '➕ 添加新酒品'}</h2>

          <div className="fg">
            <label>酒品名称 *</label>
            <input placeholder="例：莫斯科骡子" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>

          <div className="fg-row">
            <div className="fg">
              <label>分类 *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="fg">
              <label>价格 (¥) *</label>
              <input type="number" placeholder="68" value={form.price} onChange={e => set('price', e.target.value)} />
            </div>
          </div>

          <div className="fg">
            <label>简介</label>
            <input placeholder="简单描述这款酒" value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <div className="fg">
            <label>制作步骤</label>
            <textarea rows={5} placeholder={'例：\n1. 杯中加入冰块\n2. 倒入45ml伏特加\n3. 加入青柠汁'} value={form.steps} onChange={e => set('steps', e.target.value)} />
          </div>

          <div className="fg">
            <label>酒品图片</label>
            <div className="img-upload" onClick={() => fileRef.current.click()}>
              {form.image
                ? <img src={form.image} alt="preview" className="img-preview" />
                : <div className="img-ph"><span>📷</span><p>点击上传图片</p><p className="img-hint">支持 JPG/PNG，自动压缩</p></div>
              }
            </div>
            <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileRef} onChange={handleImg} />
            {form.image && <button className="btn-rm-img" onClick={() => { set('image', null); fileRef.current.value = '' }}>删除图片</button>}
          </div>

          <div className="form-actions">
            <button className="btn-pink" onClick={save}>{editId ? '保存修改' : '添加到酒单'}</button>
            {editId && <button className="btn-ghost" onClick={cancel}>取消</button>}
          </div>
        </div>

        <div className="manage-list-box">
          <div className="cat-tabs" style={{ marginBottom: 12 }}>
            {categories.map(c => (
              <button key={c} className={`cat-tab ${cat === c ? 'active' : ''}`}
                style={cat === c ? { background: CAT_STYLE[c]?.gradient } : {}}
                onClick={() => setCat(c)}>
                {c} <span className="cnt">({wines.filter(w => w.category === c).length})</span>
              </button>
            ))}
          </div>

          {list.length === 0
            ? <div className="empty">该分类暂无酒品</div>
            : list.map(w => (
                <div key={w.id} className={`mw-row ${editId === w.id ? 'editing' : ''}`}>
                  <div className="mw-img">
                    {w.image ? <img src={w.image} alt={w.name} /> : <div className="mw-img-ph" style={{ background: CAT_STYLE[w.category]?.gradient }}>{CAT_STYLE[w.category]?.emoji}</div>}
                  </div>
                  <div className="mw-info">
                    <h4>{w.name}</h4>
                    <div className="mw-meta">
                      <span className="price">¥{w.price}</span>
                      <span className="mw-sales">销量 {w.sales || 0}</span>
                    </div>
                  </div>
                  <div className="mw-actions">
                    <button className="btn-edit" onClick={() => startEdit(w)}>编辑</button>
                    <button className="btn-del" onClick={() => del(w.id)}>删除</button>
                  </div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  )
}
