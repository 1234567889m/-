import { useState, useEffect } from 'react'
import MenuPage from './pages/MenuPage'
import OrdersPage from './pages/OrdersPage'
import ManagePage from './pages/ManagePage'
import './App.css'

const IMG = 'https://www.thecocktaildb.com/images/media/drink/'

const DEFAULT_WINES = [
  // ── 伏特加 ──
  { id: 'v1', name: '血腥玛丽', category: '伏特加', description: '以番茄汁为基底，辛辣开胃，传说中最好的解酒饮料', steps: '1. 高球杯加冰\n2. 倒入45ml伏特加\n3. 加入90ml番茄汁\n4. 挤入半个柠檬汁\n5. 加辣椒汁、伍斯特酱各少许\n6. 撒盐和黑胡椒\n7. 芹菜棒装饰', image: IMG+'t6caa21582485702.jpg', sales: 0 },
  { id: 'v2', name: '法式马天尼', category: '伏特加', description: '树莓与菠萝的甜蜜融合，粉红色泽迷人', steps: '1. 摇酒壶加冰\n2. 倒入45ml伏特加\n3. 加入15ml黑树莓力娇酒\n4. 加入30ml菠萝汁\n5. 大力摇匀至起泡\n6. 过滤入冰镇马天尼杯', image: IMG+'apneom1504370294.jpg', sales: 0 },
  { id: 'v3', name: '浓缩咖啡马天尼', category: '伏特加', description: '咖啡爱好者必点，浓郁咖啡香气配伏特加', steps: '1. 摇酒壶加冰\n2. 倒入45ml伏特加\n3. 加入30ml新鲜浓缩咖啡（放凉）\n4. 加入15ml咖啡力娇酒\n5. 加入5ml糖浆\n6. 大力摇匀\n7. 过滤入马天尼杯，三颗咖啡豆装饰', image: IMG+'n0ty3p1596321498.jpg', sales: 0 },
  { id: 'v4', name: '莫斯科骡子', category: '伏特加', description: '清爽姜汁啤酒与伏特加的完美组合，铜杯最佳', steps: '1. 铜制马克杯加冰\n2. 倒入45ml伏特加\n3. 挤入半个青柠汁\n4. 填满姜汁啤酒\n5. 青柠片和薄荷叶装饰', image: IMG+'3pylqc1504370988.jpg', sales: 0 },
  { id: 'v5', name: '荔枝马天尼', category: '伏特加', description: '东南亚风情，荔枝的甜蜜与伏特加的劲道', steps: '1. 摇酒壶加冰\n2. 倒入45ml伏特加\n3. 加入30ml荔枝力娇酒\n4. 加入15ml青柠汁\n5. 加入30ml荔枝汁\n6. 摇匀过滤\n7. 荔枝果肉装饰', image: null, sales: 0 },
  { id: 'v6', name: '抹茶马天尼', category: '伏特加', description: '日式风味，抹茶的清苦与伏特加碰撞', steps: '1. 摇酒壶加冰\n2. 倒入45ml伏特加\n3. 加入15ml抹茶力娇酒\n4. 加入15ml香草利口酒\n5. 加入30ml牛奶\n6. 摇匀过滤\n7. 抹茶粉撒面', image: null, sales: 0 },
  { id: 'v7', name: '柯斯莫波利坦', category: '伏特加', description: '《欲望都市》同款，优雅粉红，酸甜迷人', steps: '1. 摇酒壶加冰\n2. 倒入40ml柠檬伏特加\n3. 加入15ml君度\n4. 加入15ml青柠汁\n5. 加入30ml蔓越莓汁\n6. 摇匀过滤入马天尼杯\n7. 橙皮装饰', image: IMG+'kpsajh1504368362.jpg', sales: 0 },
  { id: 'v8', name: '性感海滩', category: '伏特加', description: '热带水果芬芳，色彩鲜艳，度假感十足', steps: '1. 高球杯加冰\n2. 倒入45ml伏特加\n3. 加入15ml蜜桃力娇酒\n4. 加入60ml橙汁\n5. 加入60ml蔓越莓汁\n6. 轻轻搅拌\n7. 橙片装饰', image: IMG+'bpuuuu1454514794.jpg', sales: 0 },
  // ── 金酒 ──
  { id: 'g1', name: '干马天尼', category: '金酒', description: '鸡尾酒之王，007特工钟爱，简约而极致', steps: '1. 调酒杯加冰\n2. 倒入75ml金酒\n3. 加入15ml干苦艾酒\n4. 搅拌30秒\n5. 过滤入冰镇马天尼杯\n6. 橄榄或柠檬皮装饰', image: IMG+'6dj7wh1504350381.jpg', sales: 0 },
  { id: 'g2', name: '金汤力', category: '金酒', description: '最经典的高球，汤力水的苦涩衬托金酒的草本香', steps: '1. 高球杯加满冰块\n2. 倒入45ml金酒\n3. 填满汤力水\n4. 轻轻搅拌1-2次\n5. 青柠角装饰', image: IMG+'z0omyp1582480573.jpg', sales: 0 },
  { id: 'g3', name: '金菲士', category: '金酒', description: '加入苏打水和柠檬，清爽起泡，夏日首选', steps: '1. 摇酒壶加冰\n2. 倒入45ml金酒\n3. 加入30ml柠檬汁\n4. 加入15ml糖浆\n5. 摇匀后过滤入高球杯\n6. 加冰并填满苏打水\n7. 柠檬片装饰', image: IMG+'qxyxqw1454514307.jpg', sales: 0 },
  { id: 'g4', name: '内格罗尼', category: '金酒', description: '苦中带甜的意式经典，三者完美平衡', steps: '1. 岩石杯加冰\n2. 倒入30ml金酒\n3. 加入30ml金巴利\n4. 加入30ml红苦艾酒\n5. 搅拌均匀\n6. 橙皮扭转后放入', image: IMG+'qgdu971561574065.jpg', sales: 0 },
  { id: 'g5', name: '新加坡司令', category: '金酒', description: '热带风情，层次丰富，色泽鲜艳的亚洲经典', steps: '1. 摇酒壶加冰\n2. 倒入45ml金酒、15ml樱桃白兰地\n3. 加入7ml君度、7ml本尼迪克丁\n4. 加入120ml菠萝汁、15ml青柠汁\n5. 加少许红石榴糖浆\n6. 摇匀过滤入高球杯\n7. 菠萝和樱桃装饰', image: IMG+'8tvm1k1504761177.jpg', sales: 0 },
  { id: 'g6', name: '蓝色飞行', category: '金酒', description: '迷人的紫蓝色，紫罗兰花香，如梦似幻', steps: '1. 摇酒壶加冰\n2. 倒入45ml金酒\n3. 加入15ml紫罗兰力娇酒\n4. 加入15ml青柠汁\n5. 加入7ml黑樱桃力娇酒\n6. 摇匀过滤入马天尼杯\n7. 樱桃装饰', image: IMG+'rrtssw1472668972.jpg', sales: 0 },
  // ── 朗姆 ──
  { id: 'r1', name: '莫吉托', category: '朗姆', description: '古巴国民鸡尾酒，薄荷清爽，夏日灵魂', steps: '1. 高球杯放入10片薄荷叶\n2. 加入青柠角4块\n3. 加入20ml糖浆\n4. 轻轻捣压（不要压碎薄荷）\n5. 加入碎冰\n6. 倒入45ml白朗姆\n7. 填满苏打水，薄荷枝装饰', image: IMG+'metwgh1606770327.jpg', sales: 0 },
  { id: 'r2', name: '自由古巴', category: '朗姆', description: '朗姆酒与可乐的黄金搭档，加青柠点睛', steps: '1. 高球杯加满冰块\n2. 倒入45ml白朗姆\n3. 挤入1/4个青柠汁\n4. 填满可乐\n5. 青柠角装饰', image: IMG+'qvwpcd1437602975.jpg', sales: 0 },
  { id: 'r3', name: '黛吉利', category: '朗姆', description: '朗姆、青柠、糖，三种原料成就的传世经典', steps: '1. 摇酒壶加冰\n2. 倒入60ml白朗姆\n3. 加入30ml青柠汁\n4. 加入15ml简易糖浆\n5. 大力摇匀\n6. 过滤入冰镇碟形香槟杯', image: IMG+'usuaus1490406167.jpg', sales: 0 },
  { id: 'r4', name: '迈泰', category: '朗姆', description: '夏威夷派对必备，甜蜜热带风情，颜色层次分明', steps: '1. 摇酒壶加冰\n2. 倒入30ml深色朗姆、30ml白朗姆\n3. 加入15ml橙味力娇酒\n4. 加入15ml杏仁糖浆\n5. 加入30ml青柠汁\n6. 摇匀倒入装满冰的大杯\n7. 薄荷、菠萝和橙片装饰', image: IMG+'rhhwmp1493067619.jpg', sales: 0 },
  { id: 'r5', name: '暗风暴', category: '朗姆', description: '深色朗姆浮于姜汁啤酒之上，层次分明如暴风雨', steps: '1. 高球杯加冰\n2. 填入姜汁啤酒至八分\n3. 缓慢倒入45ml深色朗姆（沿杯壁）\n4. 不要搅拌，保持分层\n5. 青柠角装饰', image: IMG+'a19gls1504348888.jpg', sales: 0 },
  // ── 龙舌兰 ──
  { id: 't1', name: '玛格丽特', category: '龙舌兰', description: '墨西哥国民鸡尾酒，盐边杯口，酸甜完美平衡', steps: '1. 杯口用青柠润湿后蘸粗盐\n2. 摇酒壶加冰\n3. 倒入45ml白龙舌兰\n4. 加入25ml君度\n5. 挤入30ml青柠汁\n6. 摇匀过滤，青柠片装饰', image: IMG+'wpxpvu1439905379.jpg', sales: 0 },
  { id: 't2', name: '龙舌兰日出', category: '龙舌兰', description: '如日出般渐变的橙红色彩，视觉与味觉双重享受', steps: '1. 高球杯加冰\n2. 倒入45ml龙舌兰\n3. 填入橙汁至九分满\n4. 沿杯壁缓缓加入15ml红石榴糖浆\n5. 不搅拌，保持日出渐变效果\n6. 橙片装饰', image: IMG+'quqyqp1480879103.jpg', sales: 0 },
  { id: 't3', name: '帕洛玛', category: '龙舌兰', description: '墨西哥最受欢迎的鸡尾酒，葡萄柚清爽，比玛格丽特更日常', steps: '1. 高球杯用盐蘸杯口\n2. 加满冰块\n3. 倒入45ml龙舌兰\n4. 挤入半个葡萄柚汁\n5. 加入少许青柠汁和盐\n6. 填满葡萄柚苏打水\n7. 葡萄柚片装饰', image: IMG+'n8yp4q1504366795.jpg', sales: 0 },
  { id: 't4', name: '辣椒玛格丽特', category: '龙舌兰', description: '经典玛格丽特加辣椒，刺激过瘾，越喝越上瘾', steps: '1. 将2片辣椒片放入龙舌兰中浸泡5分钟\n2. 杯口蘸辣椒盐\n3. 摇酒壶加冰\n4. 倒入45ml辣椒龙舌兰\n5. 加入25ml君度、30ml青柠汁\n6. 摇匀过滤\n7. 辣椒片装饰', image: null, sales: 0 },
  // ── 威士忌 ──
  { id: 'w1', name: '古典鸡尾酒', category: '威士忌', description: '最古老的鸡尾酒，纯粹展现威士忌的魅力', steps: '1. 岩石杯中放入一块大冰球\n2. 加入5ml糖浆\n3. 加入2滴安格斯图拉苦精\n4. 倒入60ml波本威士忌\n5. 轻轻搅拌\n6. 橙皮扭转后装饰，可加入樱桃', image: IMG+'vrwquq1478252802.jpg', sales: 0 },
  { id: 'w2', name: '曼哈顿', category: '威士忌', description: '纽约风情，黑麦威士忌与苦艾酒的绅士结合', steps: '1. 调酒杯加冰\n2. 倒入60ml黑麦威士忌\n3. 加入30ml甜苦艾酒\n4. 加入2滴安格斯图拉苦精\n5. 搅拌30秒\n6. 过滤入冰镇碟形香槟杯\n7. 樱桃装饰', image: IMG+'reay8q1504366797.jpg', sales: 0 },
  { id: 'w3', name: '威士忌酸', category: '威士忌', description: '经典酸味鸡尾酒，蛋清带来云朵般丝滑泡沫', steps: '1. 摇酒壶放入所有材料（不加冰）\n2. 干摇30秒起泡\n3. 加冰后再次摇匀\n4. 过滤入岩石杯\n5. 橙片和樱桃装饰，蛋清泡沫上可加几滴苦精', image: IMG+'hbkfsh1589574990.jpg', sales: 0 },
  { id: 'w4', name: '薄荷朱利普', category: '威士忌', description: '肯塔基赛马节圣饮，银杯碎冰，清凉宜人', steps: '1. 银制朱利普杯放入10片薄荷叶\n2. 加入15ml糖浆，轻轻捣压\n3. 加满碎冰\n4. 倒入60ml波本威士忌\n5. 搅拌至杯身起霜\n6. 再加碎冰至杯口\n7. 薄荷枝装饰', image: IMG+'wquwxs1439912312.jpg', sales: 0 },
  { id: 'w5', name: '爱尔兰咖啡', category: '威士忌', description: '温暖的咖啡加爱尔兰威士忌，顶层鲜奶油浮云', steps: '1. 预热爱尔兰咖啡杯\n2. 倒入45ml爱尔兰威士忌\n3. 加入热咖啡至八分\n4. 加入15ml糖浆搅匀\n5. 缓缓倒入打发鲜奶油浮于表面\n6. 不搅拌，通过奶油层啜饮', image: IMG+'3ihnev1589204664.jpg', sales: 0 },
  { id: 'w6', name: '纽约酸', category: '威士忌', description: '威士忌酸的进阶版，浮一层红葡萄酒，惊艳分层', steps: '1. 摇酒壶干摇（不加冰）：60ml波本、30ml柠檬汁、15ml糖浆、半个蛋清\n2. 加冰再次摇匀\n3. 过滤入岩石杯\n4. 沿吧勺缓缓倒入15ml干红葡萄酒浮于表面\n5. 橙皮装饰', image: null, sales: 0 },
  // ── 特调 ──
  { id: 's1', name: '招牌特调', category: '特调', description: '调酒师精心创作，每日不同惊喜，限量供应', steps: '1. 询问调酒师当日特调配方\n2. 根据心情和口味推荐\n3. 每日限量，欲购从速', image: null, sales: 0 },
  { id: 's2', name: '长岛冰茶', category: '特调', description: '五种烈酒合一，看似无害实则劲大，传说中的战斗机', steps: '1. 高球杯加冰\n2. 各倒入15ml：伏特加、朗姆、金酒、龙舌兰、君度\n3. 加入30ml柠檬汁\n4. 加入少许糖浆\n5. 顶部加少量可乐呈茶色\n6. 柠檬片装饰', image: IMG+'wx7hsg1504370510.jpg', sales: 0 },
  { id: 's3', name: '蓝色夏威夷', category: '特调', description: '热带海洋蓝，椰子和菠萝的夏日狂欢', steps: '1. 摇酒壶加冰\n2. 倒入45ml伏特加或朗姆\n3. 加入30ml蓝柑橘力娇酒\n4. 加入30ml椰子朗姆\n5. 加入90ml菠萝汁\n6. 摇匀过滤入大杯\n7. 菠萝片和樱桃装饰', image: IMG+'7bwlu11504735525.jpg', sales: 0 },
  { id: 's4', name: '彩虹', category: '特调', description: '七层颜色如彩虹，视觉奇观，需要耐心和技巧', steps: '1. 彩虹杯竖放，依密度从重到轻\n2. 红石榴糖浆 → 橙汁 → 西番莲汁\n3. 柑橘汁 → 蜜桃糖浆 → 蓝柑橘\n4. 最顶层加少许龙舌兰\n5. 每层沿吧勺缓慢倒入\n6. 不搅拌，保持彩虹分层', image: null, sales: 0 },
]

const CATEGORIES = ['伏特加', '金酒', '朗姆', '龙舌兰', '威士忌', '特调']

const NAV = [
  { id: 'menu', label: '酒单', emoji: '🍸' },
  { id: 'orders', label: '订单管理', emoji: '📊' },
  { id: 'manage', label: '管理酒单', emoji: '⚙️' },
]

export default function App() {
  const [page, setPage] = useState('menu')
  const [open, setOpen] = useState(false)

  const [wines, setWines] = useState(() => {
    const s = localStorage.getItem('bar-wines-v4')
    return s ? JSON.parse(s) : DEFAULT_WINES
  })
  const [orders, setOrders] = useState(() => {
    const s = localStorage.getItem('bar-orders-v4')
    return s ? JSON.parse(s) : []
  })

  useEffect(() => { localStorage.setItem('bar-wines-v4', JSON.stringify(wines)) }, [wines])
  useEffect(() => { localStorage.setItem('bar-orders-v4', JSON.stringify(orders)) }, [orders])

  const pending = orders.filter(o => o.status === 'pending').length

  const go = (p) => { setPage(p); setOpen(false) }

  return (
    <div className="app">
      <button className="hamburger" onClick={() => setOpen(v => !v)}>
        {open ? '✕' : '☰'}
      </button>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-icon">🍹</div>
          <div>
            <h2>Bar Menu</h2>
            <p>精品鸡尾酒</p>
          </div>
        </div>
        <nav className="nav">
          {NAV.map(n => (
            <button key={n.id} className={`nav-btn ${page === n.id ? 'active' : ''}`} onClick={() => go(n.id)}>
              <span className="nav-emoji">{n.emoji}</span>
              <span>{n.label}</span>
              {n.id === 'orders' && pending > 0 && <span className="badge">{pending}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">数据保存在本地浏览器</div>
      </aside>

      <main className="main">
        {page === 'menu' && <MenuPage wines={wines} categories={CATEGORIES} setWines={setWines} setOrders={setOrders} />}
        {page === 'orders' && <OrdersPage orders={orders} setOrders={setOrders} />}
        {page === 'manage' && <ManagePage wines={wines} setWines={setWines} categories={CATEGORIES} />}
      </main>
    </div>
  )
}
