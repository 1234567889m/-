export default function OrdersPage({ orders, setOrders }) {
  const pending = orders.filter(o => o.status === 'pending')
  const done = orders.filter(o => o.status === 'done')

  const markDone = (id) => setOrders(p => p.map(o => o.id === id ? { ...o, status: 'done' } : o))
  const del = (id) => setOrders(p => p.filter(o => o.id !== id))

  const Card = ({ o }) => (
    <div className={`order-card ${o.status}`}>
      <div className="oc-head">
        <div>
          <h3>{o.customerName}</h3>
          {o.tableNo && <span className="oc-table">桌号: {o.tableNo}</span>}
        </div>
        <div className="oc-meta">
          <span className={`status-tag ${o.status}`}>
            {o.status === 'pending' ? '⏳ 待处理' : '✅ 已完成'}
          </span>
          <span className="oc-time">{o.timestamp}</span>
        </div>
      </div>
      <div className="oc-items">
        {o.items.map((it, i) => <span key={i} className="item-tag">{it.name} ×{it.qty}</span>)}
      </div>
      {o.note && <p className="oc-note">备注: {o.note}</p>}
      <div className="oc-foot">
        <span className="price big">¥{o.total}</span>
        <div className="oc-actions">
          {o.status === 'pending' && <button className="btn-done" onClick={() => markDone(o.id)}>✅ 完成</button>}
          <button className="btn-del" onClick={() => del(o.id)}>🗑️</button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📊 订单管理</h1>
        <p className="page-sub">共 {orders.length} 个订单，{pending.length} 个待处理</p>
      </div>

      {orders.length === 0
        ? <div className="empty">📭 还没有订单<br />客人可以通过「下订单」页面提交</div>
        : <>
            {pending.length > 0 && (
              <section>
                <h2 className="sec-title">⏳ 待处理 ({pending.length})</h2>
                <div className="orders-grid">{pending.map(o => <Card key={o.id} o={o} />)}</div>
              </section>
            )}
            {done.length > 0 && (
              <section>
                <h2 className="sec-title">✅ 已完成 ({done.length})</h2>
                <div className="orders-grid">{done.map(o => <Card key={o.id} o={o} />)}</div>
              </section>
            )}
          </>
      }
    </div>
  )
}
