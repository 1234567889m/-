import { useState, useEffect } from 'react'
import './App.css'

const CATEGORIES = ['伏特加', '金酒', '朗姆', '龙舌兰', '威士忌', '特调']

export default function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('wine-menu')
    return saved ? JSON.parse(saved) : {}
  })

  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', price: '', category: CATEGORIES[0] })
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0])

  useEffect(() => {
    localStorage.setItem('wine-menu', JSON.stringify(items))
  }, [items])

  const addItem = () => {
    if (!formData.name.trim()) return
    const id = Date.now().toString()
    const newItem = {
      id,
      name: formData.name,
      price: formData.price,
      category: formData.category,
      sales: 0
    }
    setItems(prev => ({ ...prev, [id]: newItem }))
    setFormData({ name: '', price: '', category: CATEGORIES[0] })
  }

  const updateItem = () => {
    if (!formData.name.trim()) return
    setItems(prev => ({
      ...prev,
      [editingId]: {
        ...prev[editingId],
        name: formData.name,
        price: formData.price,
        category: formData.category
      }
    }))
    setEditingId(null)
    setFormData({ name: '', price: '', category: CATEGORIES[0] })
  }

  const deleteItem = (id) => {
    setItems(prev => {
      const newItems = { ...prev }
      delete newItems[id]
      return newItems
    })
  }

  const increaseSales = (id) => {
    setItems(prev => ({
      ...prev,
      [id]: { ...prev[id], sales: (prev[id].sales || 0) + 1 }
    }))
  }

  const decreaseSales = (id) => {
    setItems(prev => ({
      ...prev,
      [id]: { ...prev[id], sales: Math.max(0, (prev[id].sales || 0) - 1) }
    }))
  }

  const startEdit = (item) => {
    setEditingId(item.id)
    setFormData({
      name: item.name,
      price: item.price,
      category: item.category
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ name: '', price: '', category: CATEGORIES[0] })
  }

  const categoryItems = Object.values(items).filter(item => item.category === selectedCategory)

  return (
    <div className="container">
      <header className="header">
        <h1>🍸 酒单管理系统</h1>
      </header>

      <div className="main">
        <aside className="sidebar">
          <h2>分类</h2>
          <div className="category-list">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
                <span className="count">({Object.values(items).filter(i => i.category === cat).length})</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="content">
          <div className="form-section">
            <h2>{editingId ? '编辑酒品' : '添加新酒品'}</h2>
            <div className="form">
              <input
                type="text"
                placeholder="酒品名称"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="价格"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="form-buttons">
                {editingId ? (
                  <>
                    <button className="btn btn-primary" onClick={updateItem}>保存修改</button>
                    <button className="btn btn-secondary" onClick={cancelEdit}>取消</button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={addItem}>添加</button>
                )}
              </div>
            </div>
          </div>

          <div className="items-section">
            <h2>{selectedCategory}</h2>
            {categoryItems.length === 0 ? (
              <p className="empty">暂无酒品，请添加新酒品</p>
            ) : (
              <div className="items-grid">
                {categoryItems.map(item => (
                  <div key={item.id} className="item-card">
                    <div className="item-header">
                      <h3>{item.name}</h3>
                      {item.price && <span className="price">¥{item.price}</span>}
                    </div>
                    <div className="item-sales">
                      销量: <strong>{item.sales || 0}</strong>
                    </div>
                    <div className="item-actions">
                      <button className="btn-small btn-success" onClick={() => increaseSales(item.id)}>
                        ➕ 增加
                      </button>
                      {(item.sales || 0) > 0 && (
                        <button className="btn-small btn-warning" onClick={() => decreaseSales(item.id)}>
                          ➖ 减少
                        </button>
                      )}
                      <button className="btn-small btn-edit" onClick={() => startEdit(item)}>
                        ✏️ 编辑
                      </button>
                      <button className="btn-small btn-delete" onClick={() => deleteItem(item.id)}>
                        🗑️ 删除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
