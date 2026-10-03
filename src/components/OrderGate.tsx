import { createSignal, Show } from 'solid-js';
import {
  Heart,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
} from 'lucide-solid';
import {
  grantOrderAccess,
  hasOrderAccess,
  normalizeOrderNumber,
  ORDER_PATTERN,
  verifyAdminPassphrase,
  verifyOrderNumber,
  type AccessKind,
} from '../access/orderAccess';

export { hasOrderAccess };

export function OrderGate(props: { onVerified: () => void }) {
  const [mode, setMode] = createSignal<AccessKind>('order');
  const [value, setValue] = createSignal('');
  const [error, setError] = createSignal('');
  const [busy, setBusy] = createSignal(false);

  const switchMode = (next: AccessKind) => {
    setMode(next);
    setValue('');
    setError('');
  };

  const submit = async (event: SubmitEvent) => {
    event.preventDefault();
    if (busy()) return;

    const currentMode = mode();
    const normalized =
      currentMode === 'order' ? normalizeOrderNumber(value()) : value().trim();
    setValue(normalized);

    if (currentMode === 'order' && !ORDER_PATTERN.test(normalized)) {
      setError('请输入 P 开头、共 19 位的订单编号（P 后为 18 位数字）。');
      return;
    }
    if (currentMode === 'admin' && !normalized) {
      setError('请输入管理员口令。');
      return;
    }

    setBusy(true);
    setError('');
    try {
      if (currentMode === 'order') {
        const status = await verifyOrderNumber(normalized);
        if (status === 'device-mismatch') {
          setError('这台设备已绑定另一个订单编号，只能继续使用首次绑定的订单号。');
          return;
        }
        if (status !== 'verified') {
          setError('该订单编号尚未授权，请核对后重试或联系管理员。');
          return;
        }
      } else if (!(await verifyAdminPassphrase(normalized))) {
        setError('管理员口令不正确。');
        return;
      }
      grantOrderAccess(currentMode);
      props.onVerified();
    } catch {
      setError('授权名单暂时无法读取，请刷新页面后再试。');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main class="order-gate">
      <div class="order-gate-glow order-gate-glow--one" aria-hidden="true" />
      <div class="order-gate-glow order-gate-glow--two" aria-hidden="true" />
      <section class="order-gate-card" aria-labelledby="order-gate-title">
        <div class="order-gate-badge">
          <Sparkles size={16} aria-hidden="true" />
          <span>FWTI · 非 MBTI® 官方趣味测试</span>
        </div>
        <div class="order-gate-mark" aria-hidden="true">
          <Heart size={34} fill="currentColor" />
        </div>
        <p class="order-gate-kicker">FÈIWÙ TYPE INDICATOR · V3</p>
        <h1 id="order-gate-title">
          {mode() === 'order' ? '验证订单，进入 FWTI 测试' : 'FWTI 管理员入口'}
        </h1>
        <p class="order-gate-lede">
          {mode() === 'order'
            ? '普通客户需使用已加入 GitHub 授权名单的小红书订单编号进入。'
            : '管理员可使用独立口令进入，不占用客户订单编号。'}
        </p>

        <form class="order-gate-form" onSubmit={(event) => void submit(event)} novalidate>
          <label for="access-credential">
            {mode() === 'order' ? '小红书订单编号' : '管理员口令'}
          </label>
          <div class="order-gate-input-wrap">
            <Show when={mode() === 'order'} fallback={<KeyRound size={20} aria-hidden="true" />}>
              <LockKeyhole size={20} aria-hidden="true" />
            </Show>
            <input
              id="access-credential"
              name="access-credential"
              type={mode() === 'order' ? 'text' : 'password'}
              value={value()}
              onInput={(event) => {
                setValue(event.currentTarget.value);
                if (error()) setError('');
              }}
              maxlength={mode() === 'order' ? 19 : 120}
              autocomplete={mode() === 'order' ? 'off' : 'current-password'}
              autocapitalize={mode() === 'order' ? 'characters' : 'none'}
              spellcheck={false}
              placeholder={mode() === 'order' ? 'P + 18 位数字' : '输入管理员口令'}
              aria-describedby="access-hint access-error"
              aria-invalid={!!error()}
            />
          </div>
          <p id="access-hint" class="order-gate-hint">
            {mode() === 'order'
              ? '首次验证会把订单哈希绑定到本设备；以后只能用同一订单号。GitHub 与浏览器均不保存明文。'
              : '管理员口令只在本机校验，当前浏览器标签关闭后需重新输入。'}
          </p>
          <Show when={error()}>
            <p id="access-error" class="order-gate-error" role="alert">
              {error()}
            </p>
          </Show>
          <button class="order-gate-submit" type="submit" disabled={busy()}>
            <span>{busy() ? '正在核对…' : mode() === 'order' ? '验证订单并进入' : '管理员进入'}</span>
            <Heart size={18} aria-hidden="true" />
          </button>
        </form>

        <button
          type="button"
          class="order-gate-mode-toggle"
          onClick={() => switchMode(mode() === 'order' ? 'admin' : 'order')}
        >
          {mode() === 'order' ? '我是管理员' : '返回订单验证'}
        </button>

        <div class="order-gate-privacy">
          <ShieldCheck size={18} aria-hidden="true" />
          <p>
            答案与测试记录只保存在当前浏览器。FWTI 为独立趣味内容产品，与小红书平台无隶属、授权或合作关系。
            FWTI 不是 MBTI® 测评，与 The Myers-Briggs Company / Foundation 无关联。
          </p>
        </div>
      </section>
    </main>
  );
}
