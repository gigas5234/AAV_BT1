// A standing discussion note for the alliance about how Bear Trap rallies are run.
// Opened from a floating button on the Bear Trap screen so it doesn't cost a tab.
import { type Lang } from '../i18n'

export type DiscBlock =
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }
  | { kind: 'ol'; items: string[] }
  /** A labelled arrow-chain, e.g. "Intended" vs "What actually happened". */
  | { kind: 'flow'; label: string; steps: string[] }
  /** Pulled out visually — the line that matters most in that section. */
  | { kind: 'note'; text: string }

export type DiscSection = { n: string; title: string; blocks: DiscBlock[] }

export type DiscussionDoc = {
  fab: string
  badge: string
  title: string
  lead: string[]
  sections: DiscSection[]
  close: string
}

export function discussionDoc(lang: Lang): DiscussionDoc {
  if (lang === 'ko')
    return {
      fab: '논의',
      badge: '연맹 논의',
      title: '곰 덫 운영의 구조적인 문제와 개선 방향에 대한 논의',
      lead: [
        '안녕하세요. 곰 덫을 계속 운영하면서 언젠가는 한 번 논의해야 할 문제라고 생각했습니다.',
        '지금 당장 보상의 차이가 매우 큰 것은 아니지만, 운영 방식에 대한 불만이 반복적으로 누적되면 인원 이탈이나 연맹 내 갈등으로 이어질 수 있기 때문에 미리 기준을 정할 필요가 있다고 생각합니다.',
      ],
      sections: [
        {
          n: '1',
          title: '현재 곰 덫의 가장 큰 문제',
          blocks: [
            { kind: 'p', text: '곰 덫은 참여하는 영웅과 병력이 같더라도, 어떤 집결장의 렐리에 참여하느냐에 따라 점수 차이가 매우 크게 발생합니다.' },
            { kind: 'p', text: '예를 들어 동일한 영웅과 동일한 병력을 보내더라도 다음과 같은 차이가 생길 수 있습니다.' },
            { kind: 'ul', items: ['강한 렐리 참여: 약 10M', '상대적으로 약한 렐리 참여: 약 2M'] },
            {
              kind: 'p',
              text: '이처럼 점수 차이가 크기 때문에 대부분의 인원이 자연스럽게 강한 렐리에 참여하려고 합니다. 따라서 강한 렐리는 빠르게 가득 차지만, 상대적으로 약한 렐리는 병력이 충분히 모이지 않은 상태로 출발하게 됩니다.',
            },
          ],
        },
        {
          n: '2',
          title: '기존 그룹 운영에서 발생한 문제',
          blocks: [
            { kind: 'p', text: '기존에는 강한 집결장들을 그룹 1에 모아 운영해 보았습니다. 의도했던 흐름은 다음과 같았습니다.' },
            { kind: 'flow', label: '예상 운영', steps: ['1그룹 렐리 공격', '병력 복귀', '2그룹 렐리 참여', '병력 복귀', '다시 1그룹 렐리 참여'] },
            { kind: 'p', text: '하지만 실제로는 다음과 같이 운영되었습니다.' },
            { kind: 'flow', label: '실제 운영', steps: ['1그룹 렐리 공격', '병력 복귀', '다시 1그룹 렐리 참여', '병력 복귀', '다시 1그룹 렐리 참여'] },
            {
              kind: 'p',
              text: '1그룹의 강한 렐리가 다시 열리면 대부분의 인원이 2그룹으로 이동하지 않고 다시 1그룹 렐리에 참여했습니다. 그 결과 2그룹 렐리는 남은 시간이 더 적더라도 병력이 가득 차지 않은 상태로 공격이 진행되는 경우가 발생했습니다.',
            },
            {
              kind: 'p',
              text: '하지만 개인의 입장에서는 같은 병력으로 훨씬 높은 점수를 받을 수 있는 렐리가 있는데, 일부러 점수가 낮은 렐리에 참여하라고 강요하기도 어렵습니다. 정상적으로 2그룹 렐리에 참여한 사람은 그동안 1그룹 렐리가 가득 차면서 더 좋은 점수를 받을 기회를 잃게 됩니다.',
            },
            { kind: 'note', text: '결국 현재 구조에서는 모두가 좋은 렐리를 알고 있기 때문에, 강한 렐리에 먼저 들어가는 선착순 경쟁이 발생합니다.' },
          ],
        },
        {
          n: '3',
          title: '강한 렐리를 두 그룹으로 나누려 했던 이유',
          blocks: [
            { kind: 'p', text: '이 문제를 줄이기 위해 강한 집결장들을 두 그룹으로 나누는 방식을 생각했습니다. 예를 들면 다음과 같습니다.' },
            { kind: 'ul', items: ['그룹 1: Zhapa', '그룹 2: Morillo'] },
            { kind: 'p', text: '그룹 1의 강한 렐리에 참여하지 못한 인원이 이후 그룹 2의 강한 렐리에 참여할 수 있도록 선택지를 분산하는 방식입니다.' },
            {
              kind: 'p',
              text: '또한 곰 덫은 약 30분 동안 진행되고 집결 공격시간과 개인별 병력 회군속도가 모두 다르기 때문에, 처음에는 좋지 않은 렐리에 참여했더라도 이후 타이밍이 맞으면 강한 렐리에 참여할 기회가 생길 수 있습니다. 여기까지만 보면 큰 문제가 없어 보입니다.',
            },
          ],
        },
        {
          n: '4',
          title: '1라인과 2·3라인의 구조적인 차이',
          blocks: [
            {
              kind: 'p',
              text: '하지만 실제로는 병력 복귀시간 때문에 1라인에 있는 인원들이 상당히 유리한 구조입니다. 1라인 인원들은 강한 렐리의 공격이 끝나는 시간과 자신의 병력이 복귀하는 시간이 비슷하기 때문에, 병력이 돌아오자마자 다시 강한 렐리에 참여하기 쉽습니다.',
            },
            {
              kind: 'p',
              text: '반면 2·3라인 인원들은 병력이 복귀하기 전에 다음 강한 렐리가 먼저 열리는 경우가 많습니다. 따라서 병력이 도착했을 때는 이미 강한 렐리가 모두 가득 차 있는 상황이 발생합니다. 앞으로 전체 병력 규모가 커질수록 렐리의 빈자리 부족 현상은 더 심해질 가능성이 큽니다.',
            },
            {
              kind: 'p',
              text: '다만 저는 1라인에 있는 분들이 받는 어느 정도의 이점은 인정해야 한다고 생각합니다. 1라인에 계신 분들은 상대적으로 더 많은 노력과 투자를 했고, 실제로 높은 데미지를 만들어 전체 인원의 점수를 올려주고 있습니다. 1라인 인원들이 곰 덫에 많이 참여하지 않는다면 연맹 전체의 평균 점수도 크게 낮아질 수 있습니다.',
            },
            {
              kind: 'note',
              text: '따라서 모든 차이를 완전히 없애는 것보다는, 1라인의 기여에 대한 일정 수준의 혜택은 인정하되 다른 인원들이 지나치게 불리해지지 않는 기준을 만드는 것이 필요하다고 생각합니다.',
            },
          ],
        },
        {
          n: '5',
          title: '완전히 평등하게 운영하기 어려운 이유',
          blocks: [
            { kind: 'p', text: '모든 인원에게 완전히 동일한 기회를 주려면 다음과 같은 방식이 필요합니다.' },
            {
              kind: 'flow',
              label: '그룹 1 공격 차례',
              steps: [
                '그룹 1에서 최대한 많은 렐리를 열어 대부분의 병력 수용',
                '그룹 2는 약 2분 뒤 렐리 오픈',
                '그룹 1 공격이 끝날 때까지 그룹 2로 들어오는 병력은 계속 반송',
                '그룹 2의 렐리는 그룹 1 공격이 끝날 때까지 비워 둠',
              ],
            },
            {
              kind: 'flow',
              label: '그룹 2 공격 차례',
              steps: ['그룹 1 공격 종료', '그룹 2에서 모든 병력 수용', '이번에는 그룹 1로 들어오는 병력을 계속 반송'],
            },
            { kind: 'p', text: '이 방식으로 그룹 1과 그룹 2가 번갈아 병력을 받으면 비교적 평등한 운영이 가능합니다. 하지만 현실적으로는 운영이 매우 어렵습니다.' },
            {
              kind: 'p',
              text: '단순히 “지금은 그룹 1에만 보내고 그룹 2에는 보내지 마세요”라고 공지하더라도, 분명 일부 인원은 다른 그룹에 병력을 보낼 가능성이 있습니다. 그렇게 되면 룰을 지킨 사람은 기다리면서 손해를 보고, 룰을 지키지 않은 사람은 원하는 렐리에 참여해 더 높은 점수를 받는 문제가 발생합니다.',
            },
            { kind: 'note', text: '저는 룰을 잘 지키는 분들이 오히려 손해를 보는 구조를 만들고 싶지 않습니다.' },
            { kind: 'p', text: '또한 집결장들은 짧은 시간 동안 다음 항목을 모두 확인해야 합니다.' },
            { kind: 'ul', items: ['참여 병력 규모', '첫 번째 영웅', '잘못 들어온 병력의 복귀 처리', '렐리 출발시간', '다음 렐리 준비'] },
            {
              kind: 'p',
              text: '기존에도 병력과 첫 번째 영웅을 확인하기 어려운데, 여기에 그룹별 병력 통제까지 추가하면 집결장들의 부담이 지나치게 커집니다. 따라서 이 방식은 이론적으로는 가장 평등하지만, 실제로 지속적으로 운영하기는 어렵다고 판단했습니다.',
            },
          ],
        },
        {
          n: '6',
          title: '오늘 곰 덫에서 확인된 또 다른 문제',
          blocks: [
            {
              kind: 'p',
              text: '오늘은 참여 인원이 많을 것으로 예상해 평소보다 많은 렐리를 열었습니다. 하지만 실제로는 절반도 채워지지 않은 렐리들이 발생했습니다.',
            },
            {
              kind: 'p',
              text: '이 경우 해당 렐리를 연 집결장과 렐리에 참여한 인원들은 모두 손해를 보게 됩니다. 그 병력을 강한 렐리에 보냈다면 더 높은 점수를 받을 수 있었지만, 직접 렐리를 열거나 인원이 적은 렐리에 참여하면서 상대적으로 낮은 점수를 받게 되기 때문입니다. 이런 경험이 반복되면 집결장 입장에서는 굳이 자신의 병력과 시간을 사용해 렐리를 열고 싶지 않을 수 있습니다.',
            },
            { kind: 'p', text: '결국 다음 두 가지 문제가 동시에 존재합니다.' },
            { kind: 'ul', items: ['렐리를 너무 적게 열면 참여하지 못하는 인원이 발생합니다.', '렐리를 너무 많이 열면 병력이 분산되어 빈 렐리 또는 낮은 데미지의 렐리가 증가합니다.'] },
            { kind: 'note', text: '따라서 실제 참여 인원과 보유 병력 규모를 기준으로 적정한 렐리 수를 정하는 것이 매우 중요합니다.' },
          ],
        },
        {
          n: '7',
          title: '앞으로 정해야 할 운영 기준',
          blocks: [
            { kind: 'p', text: '곰 덫은 2일마다 반복되는 이벤트이기 때문에, 한 번 합리적인 기준을 정하면 이후에는 큰 혼란 없이 운영할 수 있다고 생각합니다. 앞으로는 다음 항목에 대한 기준을 논의할 필요가 있습니다.' },
            {
              kind: 'ol',
              items: [
                '실제 참여 인원에 따른 적정 렐리 수',
                '강한 집결장을 그룹별로 어떻게 분배할지',
                '1라인의 기여와 혜택을 어느 정도까지 인정할지',
                '2·3라인 인원에게 최소한의 강한 렐리 참여 기회를 어떻게 제공할지',
                '인원이 부족한 렐리가 발생했을 때 출발 또는 취소 기준',
                '집결장에게 지나치게 많은 통제 업무를 요구하지 않는 운영 방식',
                '룰을 지키는 사람이 손해를 보지 않도록 하는 기준',
              ],
            },
          ],
        },
        {
          n: '8',
          title: '결론',
          blocks: [
            {
              kind: 'p',
              text: '곰 덫의 문제는 단순히 누군가가 강한 렐리에만 들어가려고 하기 때문에 발생하는 문제가 아닙니다. 동일한 병력을 보내더라도 집결장의 강함에 따라 점수 차이가 지나치게 크게 발생하고, 병력 복귀시간과 위치에 따라 다음 렐리에 참여할 수 있는 기회가 달라지는 구조적인 문제입니다.',
            },
            {
              kind: 'p',
              text: '또한 무조건 평등하게 운영하려 하면 룰을 지키는 인원이 손해를 보거나 집결장의 운영 부담이 지나치게 커질 수 있습니다. 반대로 자유롭게 운영하면 강한 렐리는 선착순 경쟁이 되고, 상대적으로 약한 렐리와 해당 렐리를 연 집결장들이 계속 손해를 보게 됩니다.',
            },
            { kind: 'p', text: '따라서 완벽한 평등을 만드는 것보다는 다음 세 가지의 균형을 맞추는 것이 중요하다고 생각합니다.' },
            { kind: 'ul', items: ['높은 데미지를 만드는 1라인 인원의 기여 인정', '다른 인원들에게도 합리적인 참여 기회 제공', '실제로 지속할 수 있는 단순한 운영 방식 마련'] },
            {
              kind: 'note',
              text: '현재는 대부분의 인원이 좋은 점수를 받고 있어 보상 차이가 크지 않을 수 있습니다. 하지만 작은 불만이 반복적으로 누적되면 결국 연맹 전체의 문제가 될 수 있습니다. 서로의 입장을 이해하면서 장기적으로 유지할 수 있는 운영 기준을 함께 논의했으면 합니다.',
            },
          ],
        },
      ],
      close: '닫기',
    }

  return {
    fab: 'Discussion',
    badge: 'Alliance discussion',
    title: 'Bear Trap: the structural problem with how we run it, and how we might fix it',
    lead: [
      'Hi everyone. Running Bear Trap over time, I think this is something we were always going to have to talk about at some point.',
      'The reward gap isn’t huge right now, but if frustration with how we run it keeps building up it can lead to people leaving or to friction inside the alliance — so I think it’s worth agreeing on some ground rules before that happens.',
    ],
    sections: [
      {
        n: '1',
        title: 'The core problem with Bear Trap today',
        blocks: [
          { kind: 'p', text: 'Even with the exact same heroes and the exact same troops, your score changes enormously depending on whose rally you join.' },
          { kind: 'p', text: 'Sending identical heroes and identical troops can produce results as far apart as this:' },
          { kind: 'ul', items: ['Joining a strong rally: around 10M', 'Joining a weaker rally: around 2M' ] },
          {
            kind: 'p',
            text: 'Because the gap is that large, almost everyone naturally tries to join the strong rallies. So strong rallies fill up fast, while weaker ones end up launching without enough troops in them.',
          },
        ],
      },
      {
        n: '2',
        title: 'What went wrong with the group setup we tried',
        blocks: [
          { kind: 'p', text: 'We previously put the strong rally leaders together in Group 1. The flow we intended was this:' },
          { kind: 'flow', label: 'Intended', steps: ['Group 1 rally attacks', 'Troops return', 'Join a Group 2 rally', 'Troops return', 'Join Group 1 again'] },
          { kind: 'p', text: 'What actually happened was this:' },
          { kind: 'flow', label: 'In practice', steps: ['Group 1 rally attacks', 'Troops return', 'Join Group 1 again', 'Troops return', 'Join Group 1 again'] },
          {
            kind: 'p',
            text: 'As soon as a strong Group 1 rally reopened, most people went back into Group 1 instead of moving to Group 2. As a result, Group 2 rallies often had to attack without being full — sometimes with even less time left on the clock.',
          },
          {
            kind: 'p',
            text: 'But from an individual’s point of view, it’s hard to tell someone to deliberately join a lower-scoring rally when a much better one is right there for the same troops. And the people who did the right thing and joined Group 2 lose out, because Group 1 fills up in the meantime and they miss the better score.',
          },
          { kind: 'note', text: 'So under the current structure, everyone knows which rallies are good — and it turns into a first-come-first-served race into the strong ones.' },
        ],
      },
      {
        n: '3',
        title: 'Why we considered splitting the strong leaders across both groups',
        blocks: [
          { kind: 'p', text: 'To reduce that, we considered splitting the strong rally leaders across the two groups. For example:' },
          { kind: 'ul', items: ['Group 1: Zhapa', 'Group 2: Morillo'] },
          { kind: 'p', text: 'The idea is to spread out the options, so anyone who couldn’t get into the strong Group 1 rally still has a strong Group 2 rally to join afterwards.' },
          {
            kind: 'p',
            text: 'Bear Trap also runs for about 30 minutes, and both rally attack times and individual march-return speeds vary, so even if you start out in a poor rally, the timing can work out and give you a shot at a strong one later. Looked at only this far, it seems fine.',
          },
        ],
      },
      {
        n: '4',
        title: 'The structural gap between line 1 and lines 2–3',
        blocks: [
          {
            kind: 'p',
            text: 'In reality, though, march-return time gives the people in line 1 a significant advantage. For them, the moment a strong rally’s attack ends lines up closely with the moment their own troops get home — so they can jump straight back into the next strong rally.',
          },
          {
            kind: 'p',
            text: 'For people in lines 2 and 3, the next strong rally often opens before their troops are even back. By the time their troops arrive, the strong rallies are already full. And as our overall troop numbers grow, the shortage of open slots is likely to get worse.',
          },
          {
            kind: 'p',
            text: 'That said, I think we should accept that the line 1 players get some advantage. They have put in relatively more effort and investment, and they generate the high damage that lifts everyone’s score. If the line 1 players stopped showing up to Bear Trap, the alliance average would drop a lot.',
          },
          {
            kind: 'note',
            text: 'So rather than trying to erase every difference, I think we need a standard that acknowledges line 1’s contribution while making sure everyone else isn’t left at too much of a disadvantage.',
          },
        ],
      },
      {
        n: '5',
        title: 'Why perfectly equal operation is hard',
        blocks: [
          { kind: 'p', text: 'To give everyone genuinely equal opportunity, we would have to run it like this:' },
          {
            kind: 'flow',
            label: 'Group 1’s turn',
            steps: [
              'Group 1 opens as many rallies as possible to take most of the troops',
              'Group 2 opens its rallies about 2 minutes later',
              'Any troops arriving at Group 2 get sent back until Group 1’s attack finishes',
              'Group 2’s rallies stay empty until Group 1 has attacked',
            ],
          },
          { kind: 'flow', label: 'Group 2’s turn', steps: ['Group 1’s attack ends', 'Group 2 takes all the troops', 'Now troops arriving at Group 1 get sent back'] },
          { kind: 'p', text: 'Alternating which group receives troops like this would be reasonably equal. In practice, though, it is very hard to run.' },
          {
            kind: 'p',
            text: 'Even if we announce “right now send only to Group 1, not Group 2,” some people will certainly still send to the other group. Then the people who followed the rule lose out while they wait, and the people who ignored it get into the rally they wanted and score higher.',
          },
          { kind: 'note', text: 'I don’t want to build a structure where the people who follow the rules are the ones who lose out.' },
          { kind: 'p', text: 'On top of that, rally leaders have to check all of the following in a very short window:' },
          { kind: 'ul', items: ['How many troops have joined', 'The first hero', 'Sending back troops that joined the wrong rally', 'The rally launch time', 'Preparing the next rally'] },
          {
            kind: 'p',
            text: 'Checking troops and first heroes is already hard enough; adding per-group troop control on top would put far too much on the rally leaders. So while this approach is the most equal in theory, I concluded it isn’t something we can actually sustain.',
          },
        ],
      },
      {
        n: '6',
        title: 'Another problem we saw in today’s Bear Trap',
        blocks: [
          { kind: 'p', text: 'Today we expected a high turnout, so we opened more rallies than usual. In the end, some of them didn’t even fill halfway.' },
          {
            kind: 'p',
            text: 'When that happens, both the leader who opened that rally and everyone who joined it lose out: those same troops would have scored more in a strong rally, but by opening a rally themselves or joining an under-filled one, they end up with a relatively low score. If that keeps happening, leaders may simply stop wanting to spend their own troops and time opening rallies.',
          },
          { kind: 'p', text: 'So we have two opposing problems at once:' },
          { kind: 'ul', items: ['Open too few rallies and some people can’t take part at all.', 'Open too many and the troops get spread thin, producing empty or low-damage rallies.'] },
          { kind: 'note', text: 'That makes it very important to set the right number of rallies based on the actual turnout and the troops people have.' },
        ],
      },
      {
        n: '7',
        title: 'What we need to agree on going forward',
        blocks: [
          { kind: 'p', text: 'Bear Trap repeats every two days, so once we agree on something sensible, I think we can run it afterwards without much confusion. These are the points I think we should settle:' },
          {
            kind: 'ol',
            items: [
              'The right number of rallies for the actual turnout',
              'How to distribute the strong rally leaders across the groups',
              'How much advantage we recognise for line 1’s contribution',
              'How to guarantee lines 2–3 at least some access to strong rallies',
              'When to launch versus cancel a rally that is short on troops',
              'A way of running it that doesn’t pile control work onto rally leaders',
              'A standard that ensures people who follow the rules don’t lose out',
            ],
          },
        ],
      },
      {
        n: '8',
        title: 'Conclusion',
        blocks: [
          {
            kind: 'p',
            text: 'The Bear Trap problem isn’t simply that some people only want to join the strong rallies. It’s structural: the same troops score wildly differently depending on how strong the rally leader is, and your chance at the next rally depends on your march-return time and your position on the map.',
          },
          {
            kind: 'p',
            text: 'At the same time, forcing strict equality either penalises the people who follow the rules or puts too much operational load on the rally leaders. And leaving it completely open turns the strong rallies into a race, with the weaker rallies — and the leaders who opened them — losing out over and over.',
          },
          { kind: 'p', text: 'So rather than chasing perfect equality, I think the important thing is to balance these three:' },
          {
            kind: 'ul',
            items: ['Recognising the contribution of the line 1 players who generate the high damage', 'Giving everyone else a fair chance to take part', 'Keeping the way we run it simple enough to actually sustain'],
          },
          {
            kind: 'note',
            text: 'Right now most people are scoring well, so the reward gap may not feel big. But small frustrations, repeated, eventually become an alliance-wide problem. I’d like us to understand each other’s positions and work out a standard we can keep to long term.',
          },
        ],
      },
    ],
    close: 'Close',
  }
}
