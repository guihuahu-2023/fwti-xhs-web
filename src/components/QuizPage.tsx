import { createEffect, createSignal, For, Show } from 'solid-js';
import { ArrowLeft, ArrowRight } from 'lucide-solid';
import {
  resolveQuestionText,
  resolveOptionText,
  type Question,
} from '../copy/questions';
import {
  getRelationshipStatusV3 as getRelationshipStatus,
  type RelationshipStatusV3OrNull as RelationshipStatus,
} from '../logic/v3/flow';
import { quizPageCopy } from '../copy/ui';
import { TopNav } from './Nav';

export function QuizPage(props: {
  path: Question[];
  mainTotal: number;
  mainProgress: number;
  metaAnswered: boolean;
  answers: Record<number, number>;
  onSelect: (qId: number, optionIdx: number) => void;
  onSubmit: () => void;
  canSubmit: boolean;
}) {
  const [activeIndex, setActiveIndex] = createSignal(0);
  const pct = () =>
    props.mainTotal === 0
      ? 0
      : Math.round((props.mainProgress / props.mainTotal) * 100);
  const status = (): RelationshipStatus => getRelationshipStatus(props.answers);
  const current = () => props.path[activeIndex()];
  const mainIndexOf = (qId: number): number => {
    let index = 0;
    for (const question of props.path) {
      if (question.dimension === 'META') continue;
      index += 1;
      if (question.id === qId) return index;
    }
    return 0;
  };
  const mainLeft = () => Math.max(0, props.mainTotal - props.mainProgress);
  const submitLabel = () => {
    if (props.canSubmit) return quizPageCopy.viewResult;
    if (!props.metaAnswered) return quizPageCopy.completeMeta;
    return quizPageCopy.remainingQuestions(mainLeft());
  };

  createEffect(() => {
    if (activeIndex() >= props.path.length) {
      setActiveIndex(Math.max(0, props.path.length - 1));
    }
  });

  const choose = (question: Question, optionIndex: number) => {
    props.onSelect(question.id, optionIndex);
    window.setTimeout(() => {
      setActiveIndex((index) => Math.min(index + 1, props.path.length - 1));
    }, 180);
  };

  const goBack = () => setActiveIndex((index) => Math.max(0, index - 1));
  const goForward = () =>
    setActiveIndex((index) => Math.min(props.path.length - 1, index + 1));

  return (
    <div class="page quiz-page quiz-page--stepper">
      <TopNav meta={quizPageCopy.topMeta(props.mainProgress, props.mainTotal)} />

      <section class="quiz-hero">
        <div class="quiz-hero-inner">
          <div class="quiz-hero-copy">
            <p class="quiz-hero-kicker">FOLLOW YOUR FIRST FEELING</p>
            <h1 class="quiz-hero-title">{quizPageCopy.heroTitle}</h1>
            <p class="quiz-hero-sub">{quizPageCopy.heroSubtitle}</p>
          </div>
          <div class="quiz-progress-orbit" aria-label={`已完成 ${pct()}%`}>
            <span>{pct()}%</span>
          </div>
        </div>
      </section>

      <main class="quiz-stage">
        <Show when={current()}>
          {(question) => (
            <article id={`q-${question().id}`} class="quiz-item quiz-step-card">
              <div class="quiz-item-head">
                <Show
                  when={question().dimension !== 'META'}
                  fallback={<span class="quiz-item-num quiz-item-num-meta">状态选择</span>}
                >
                  <span class="quiz-item-num">
                    第 {mainIndexOf(question().id)} / {props.mainTotal} 题
                  </span>
                </Show>
                <Show when={question().tag && question().dimension !== 'META'}>
                  <span class="quiz-item-tag">{question().tag}</span>
                </Show>
              </div>

              <p class="quiz-item-text">
                {resolveQuestionText(question(), status())}
              </p>
              <Show when={question().dimension === 'META'}>
                <p class="quiz-item-note">{quizPageCopy.metaNote}</p>
              </Show>

              <div class="quiz-options" role="group" aria-label={quizPageCopy.optionGroupAria}>
                <For each={question().options}>
                  {(option, optionIndex) => (
                    <button
                      type="button"
                      class="quiz-opt"
                      classList={{
                        'is-selected': props.answers[question().id] === optionIndex(),
                      }}
                      aria-pressed={props.answers[question().id] === optionIndex()}
                      aria-label={quizPageCopy.optionAria(option.label)}
                      onClick={() => choose(question(), optionIndex())}
                    >
                      <span class="quiz-opt-badge">{option.label}</span>
                      <span class="quiz-opt-text">
                        {resolveOptionText(question(), optionIndex(), status())}
                      </span>
                    </button>
                  )}
                </For>
              </div>

              <div class="quiz-step-controls">
                <button
                  type="button"
                  class="quiz-step-nav"
                  onClick={goBack}
                  disabled={activeIndex() === 0}
                >
                  <ArrowLeft size={18} aria-hidden="true" />
                  <span>上一题</span>
                </button>
                <span class="quiz-step-count">
                  {activeIndex() + 1} / {props.path.length}
                </span>
                <button
                  type="button"
                  class="quiz-step-nav"
                  onClick={goForward}
                  disabled={
                    activeIndex() >= props.path.length - 1 ||
                    props.answers[question().id] === undefined
                  }
                >
                  <span>下一题</span>
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              </div>
            </article>
          )}
        </Show>
      </main>

      <div id="submit-bar" class="submit-bar">
        <div class="submit-bar-inner">
          <div class="submit-bar-progress">
            <div class="submit-progress-track">
              <div class="submit-progress-fill" style={{ width: `${pct()}%` }} />
            </div>
            <span class="submit-progress-pct">{pct()}%</span>
          </div>
          <button
            class="btn btn-green"
            onClick={props.onSubmit}
            disabled={!props.canSubmit}
          >
            <span>{submitLabel()}</span>
            <Show when={props.canSubmit}>
              <ArrowRight size={18} aria-hidden="true" />
            </Show>
          </button>
        </div>
      </div>
    </div>
  );
}
