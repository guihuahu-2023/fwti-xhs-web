import type { Result } from './scoring';

type Axis = 'C' | 'R' | 'A' | 'S';
type Band = 'positive' | 'balanced' | 'negative';

interface Guide {
  strength: string;
  watch: string;
  action: string;
  script: string;
  week: string;
}

const GUIDES: Record<Axis, Record<Band, Guide>> = {
  C: {
    positive: {
      strength: '你愿意主动靠近、表达喜欢，也更容易让关系真正向前走。',
      watch: '当回应不够快时，你可能会把“再努力一点”当成唯一解法，忘了观察对方是否也在靠近。',
      action: '每次主动后给关系留一个回应窗口：先不补发第二条消息，去完成一件自己的小事。',
      script: '“我很想见你，也想知道你的节奏。你更希望我们什么时候联系？”',
      week: '这一周，每次主动一次后就暂停追问，记录对方是否会自然接住你。',
    },
    balanced: {
      strength: '你通常能在主动与等待之间切换，不容易一上头就失去自己的步调。',
      watch: '过度追求“刚刚好”时，也可能错过需要更明确表达的时刻。',
      action: '遇到真正重要的人或事，练习把暗示换成一句明确而轻盈的邀请。',
      script: '“我对你有好感，想继续了解；如果你也愿意，我们约个时间见面吧。”',
      week: '挑一件你一直等别人开口的事，主动提出一次清楚、可拒绝的邀请。',
    },
    negative: {
      strength: '你懂得保护自己的节奏，不会轻易被关系牵着跑。',
      watch: '当你用沉默避免尴尬时，对方可能只能把它理解成冷淡或拒绝。',
      action: '不需要突然变热情，只要在想躲开时多交代一句，让对方知道这不是消失。',
      script: '“我这两天需要一点自己的时间，不是对你没兴趣，我会在周末再联系你。”',
      week: '本周选一次原本会已读不回的时刻，用一句短说明替代消失。',
    },
  },
  R: {
    positive: {
      strength: '你能快速识别并表达感受，关系里很少需要别人猜你的心。',
      watch: '情绪速度快于问题本身时，表达容易从“让我被理解”变成“让对方也难受”。',
      action: '把第一反应先写进备忘录，等身体平静十分钟后，再决定哪一句值得发出去。',
      script: '“我现在有点上头，怕越说越偏。给我十分钟，我想回来把真正介意的点说清楚。”',
      week: '连续 7 天记录一次情绪：发生了什么、我脑中怎么解释、我真正需要什么。',
    },
    balanced: {
      strength: '你大多能让情绪被看见，又不让情绪接管整场对话。',
      watch: '太擅长稳定场面时，偶尔会把自己的真实需要放到最后。',
      action: '每次讨论完“怎么办”，再补一句“这件事让我有什么感受”。',
      script: '“解决办法我同意；我还想让你知道，刚才那一刻我其实有点委屈。”',
      week: '本周至少表达三次具体感受，不只说“没事”“都行”或“可以”。',
    },
    negative: {
      strength: '你不轻易把情绪甩给别人，遇到冲突时通常有很强的自我控制力。',
      watch: '长期只消化不表达，会让委屈以冷淡、疏远或突然爆发的方式回来。',
      action: '从低风险感受开始练习，用“事实—感受—需要”三句话说出来。',
      script: '“昨天你临时取消时，我有点失落。我需要提前一点知道变化，下次可以早点告诉我吗？”',
      week: '找一个安全的人，完成一次不超过三分钟的“事实—感受—需要”表达。',
    },
  },
  A: {
    positive: {
      strength: '你愿意投入陪伴，也很会让喜欢的人感受到被惦记和被需要。',
      watch: '亲密感下降一点时，你可能会立刻加码联系，把空间误读成感情变淡。',
      action: '把“想黏在一起”拆成具体请求，避免用查岗、试探或赌气换确认。',
      script: '“我今天很想和你有一点连接。你方便睡前聊十分钟，还是明天一起吃饭？”',
      week: '每天保留一段只属于自己的时间，做一件与关系无关、却能给你充电的事。',
    },
    balanced: {
      strength: '你通常既能享受靠近，也能保留各自生活，关系弹性比较好。',
      watch: '习惯自然切换的人，可能低估对方对联系频率和边界的不同需求。',
      action: '别只靠默契，和对方交换一次“舒服的联系频率”和“需要独处的信号”。',
      script: '“我觉得我们现在的距离挺舒服，也想听听你：什么样的联系频率最自在？”',
      week: '安排一次 15 分钟关系对话，只聊“什么会让我更舒服”，不评价谁对谁错。',
    },
    negative: {
      strength: '你有稳定的个人世界，懂得让亲密关系之外的生活继续生长。',
      watch: '当亲密变得密集，你可能先撤退再解释，让对方把边界感理解成不在乎。',
      action: '在需要空间时同时给出“边界 + 回来时间”，减少无期限的失联。',
      script: '“我今晚想自己安静一下，但我很在意你。明天下午我来找你，我们再好好聊。”',
      week: '本周每次说“我想一个人待会儿”时，都加上一个明确的重新连接时间。',
    },
  },
  S: {
    positive: {
      strength: '你对关系变化很敏锐，常能比别人更早发现没有被说出口的问题。',
      watch: '敏锐变成警报时，一个延迟回复也可能被脑补成整段关系的坏消息。',
      action: '区分“事实”和“解释”：先写下看见了什么，再写下你猜发生了什么。',
      script: '“你今天回复比平时慢，我有点不安。是你在忙，还是我们之间有需要聊的事？”',
      week: '出现不安时，先找出一个事实、两个可能解释，再决定是否询问。',
    },
    balanced: {
      strength: '你大多能信任关系，也愿意在有疑问时寻找信息而不是直接下结论。',
      watch: '看起来很稳定的人，也可能因为怕显得敏感而拖到问题累积后才开口。',
      action: '把小小的不舒服提早说，用好奇代替审问，别等到它长成结论。',
      script: '“我不确定是不是我理解偏了，想和你核对一下刚才那句话的意思。”',
      week: '本周发现一次小疑问时，在 24 小时内温和核对，不让它靠脑补发酵。',
    },
    negative: {
      strength: '你比较能给关系信任和呼吸感，不会轻易把每个变化都当成危机。',
      watch: '太佛系时，你可能把真正需要处理的信号也归类为“小事”。',
      action: '给重要边界设底线：同类问题反复出现时，不只笑笑带过，而是明确讨论。',
      script: '“我相信你，也不想查岗；但这件事连续发生让我不舒服，我们需要一起定个办法。”',
      week: '写下三条你不会用“算了”带过的关系底线，并为每条配一个清楚的表达。',
    },
  },
};

const AXIS_LABEL: Record<Axis, string> = {
  C: '接触节奏',
  R: '情绪调节',
  A: '亲密距离',
  S: '安全感',
};

function band(value: number): Band {
  if (value >= 0.15) return 'positive';
  if (value <= -0.15) return 'negative';
  return 'balanced';
}

function scoreOf(result: Result, axis: Axis): number {
  if (axis === 'C') return result.scores.GD;
  if (axis === 'R') return result.scores.ZR;
  if (axis === 'A') return result.scores.NL;
  return result.scores.YF;
}

export interface GrowthPlan {
  strengths: string[];
  watchouts: string[];
  actions: string[];
  scripts: string[];
  week: string;
}

export function buildGrowthPlan(result: Result): GrowthPlan {
  const axes = (['C', 'R', 'A', 'S'] as Axis[])
    .map((axis) => ({
      axis,
      score: scoreOf(result, axis),
      guide: GUIDES[axis][band(scoreOf(result, axis))],
    }))
    .sort((a, b) => Math.abs(b.score) - Math.abs(a.score));

  const leading = axes.slice(0, 2);
  return {
    strengths: leading.map(({ axis, guide }) => `${AXIS_LABEL[axis]}：${guide.strength}`),
    watchouts: leading.map(({ axis, guide }) => `${AXIS_LABEL[axis]}：${guide.watch}`),
    actions: [
      leading[0].guide.action,
      leading[1].guide.action,
      result.personality.advice,
    ],
    scripts: leading.map(({ guide }) => guide.script),
    week: leading[0].guide.week,
  };
}
