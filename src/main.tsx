import {
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  Show,
  Switch,
  Match,
} from 'solid-js';
import { render } from 'solid-js/web';
import {
  HomePage,
  Layout,
  QuizPage,
  ResultPage,
  answers,
  retreatCount,
  setAnswers,
  setRetreatCount,
} from './App';
import { HistoryPage } from './components/HistoryPage';
import { hasOrderAccess, OrderGate } from './components/OrderGate';
import { metaQuestionId, applyAnswerSelection } from './logic/answers';
import { decodeAnswers, encodeAnswersV3 } from './logic/codec';
import { saveToHistory } from './logic/history';
import { getResult, type Result } from './logic/scoring';
import { getLegacyResultV1 } from './logic/legacy/scoring-v1';
import { getResultV3 } from './logic/v3/scoring';
import {
  buildQuestionPathV3,
  getRelationshipStatusV3,
  isPathCompleteV3,
} from './logic/v3/flow';
import type { Question } from './copy/questions';
import { currentRoute, navigate, startRouter } from './router';

function HomeView() {
  return (
    <HomePage
      onStart={() => {
        setAnswers({});
        setRetreatCount(0);
        void navigate('/quiz');
      }}
    />
  );
}

function QuizView() {
  const metaAnswered = () => answers()[metaQuestionId] !== undefined;
  const status = () => getRelationshipStatusV3(answers());
  const path = () => buildQuestionPathV3(answers(), status());
  const nonMetaPath = () => path().filter((q) => q.dimension !== 'META');
  const mainTotal = () => nonMetaPath().length;
  const mainProgress = () => {
    const current = answers();
    return nonMetaPath().filter((q) => current[q.id] !== undefined).length;
  };
  const canSubmit = () => isPathCompleteV3(answers(), status());

  function selectOption(qId: number, optionIdx: number) {
    const previous = answers();
    if (
      qId !== metaQuestionId &&
      previous[qId] !== undefined &&
      previous[qId] !== optionIdx
    ) {
      setRetreatCount((count) => count + 1);
    }
    setAnswers((current) => applyAnswerSelection(current, qId, optionIdx));
  }

  function submitQuiz() {
    const relationship = status();
    if (relationship === null || !canSubmit()) return;
    const encoded = encodeAnswersV3(answers(), relationship);
    void navigate(`/result/${encoded}`);
  }

  return (
    <QuizPage
      path={path() as unknown as Question[]}
      mainTotal={mainTotal()}
      mainProgress={mainProgress()}
      metaAnswered={metaAnswered()}
      answers={answers()}
      onSelect={selectOption}
      onSubmit={submitQuiz}
      canSubmit={canSubmit()}
    />
  );
}

function ResultView(props: { hash: string }) {
  const rendered = createMemo<
    { result: Result; isLegacy: boolean; hash: string } | null
  >(() => {
    const decoded = decodeAnswers(props.hash);
    if (!decoded) return null;
    if (decoded.version === 1) {
      return {
        result: getLegacyResultV1(decoded.answers, 0) as Result,
        isLegacy: true,
        hash: props.hash,
      };
    }
    if (decoded.version === 2) {
      return {
        result: getResult(decoded.answers, 0, decoded.status),
        isLegacy: true,
        hash: props.hash,
      };
    }
    return {
      result: getResultV3(decoded.answers, 0, decoded.status) as unknown as Result,
      isLegacy: false,
      hash: props.hash,
    };
  });

  createEffect(() => {
    const current = rendered();
    if (current) saveToHistory(current.result, current.hash);
  });

  return (
    <Show
      when={rendered()}
      fallback={
        <section class="route-error">
          <h1>这份结果链接好像不完整</h1>
          <p>请返回首页重新测试，或让分享者重新复制完整链接。</p>
          <button class="btn btn-accent" onClick={() => void navigate('/')}>返回首页</button>
        </section>
      }
    >
      {(current) => (
        <ResultPage
          result={current().result}
          isLegacy={current().isLegacy}
          hash={current().hash}
          onRestart={() => {
            setAnswers({});
            setRetreatCount(0);
            void navigate('/quiz');
          }}
        />
      )}
    </Show>
  );
}

function AppRouter() {
  const route = currentRoute();

  createEffect(() => {
    const path = route();
    const title = path.startsWith('/result/')
      ? '我的 FWTI · 测试结果'
      : path === '/quiz'
        ? '测试中 · FWTI'
        : path === '/history'
          ? '测试记录 · FWTI'
          : 'FWTI · 自嘲型恋爱人格测试（非 MBTI® 官方测评）';
    document.title = title;
  });

  return (
    <Switch fallback={<HomeView />}>
      <Match when={route() === '/' || route() === ''}>
        <HomeView />
      </Match>
      <Match when={route() === '/quiz'}>
        <QuizView />
      </Match>
      <Match when={route() === '/history'}>
        <HistoryPage />
      </Match>
      <Match when={route().startsWith('/result/')}>
        <ResultView hash={route().slice('/result/'.length)} />
      </Match>
    </Switch>
  );
}

function Root() {
  const [unlocked, setUnlocked] = createSignal(hasOrderAccess());

  onMount(() => {
    const stopRouter = startRouter();
    onCleanup(stopRouter);
  });

  return (
    <Layout>
      <Show
        when={unlocked()}
        fallback={<OrderGate onVerified={() => setUnlocked(true)} />}
      >
        <AppRouter />
      </Show>
    </Layout>
  );
}

const mount = document.getElementById('root');
if (!mount) throw new Error('Missing #root mount point');
render(() => <Root />, mount);
