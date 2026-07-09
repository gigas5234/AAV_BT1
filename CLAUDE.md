# Kingshot Bear Trap Rally Planner

킹샷(Kingshot) **곰덫(Bear Hunt / Pitfall)** 이벤트에서, 오늘 참여 인원을 체크하면
자동으로 **교대 웨이브(1조/2조)** 를 나누고 **메인 집결 / 서브 집결**을 구분해 보여주는
한국어 단일 페이지 웹앱.

> 이 문서는 **살아있는 스펙(v1)** 이다. 세부는 계속 업데이트한다.
> 원안(사용자 초기 요청) 대비 **게임 메커니즘에 맞춰 수정한 부분**은 각 섹션에 `⚠ 변경` 으로 표기했다.

---

## 0. 게임 메커니즘 근거 (이 앱이 왜 이렇게 계산하는가)

곰덫에 대해 확인한 사실(2026-07 기준 커뮤니티 가이드):

- **이벤트**: Pitfall에서 **30분**, 이틀에 한 번. **연맹 총 데미지**로 연맹 보상, **개인 데미지**로 개인 보상.
- **집결 = 호스트(집결자) + 참여자**.
  - **호스트의 스탯·기어·버프·연구 + 영웅 3스킬 전부**가 집결 전체에 적용된다.
  - **참여자는 오직 "병력 + 1번 영웅의 1번 원정 스킬"만** 기여한다. (기어/차밍/연구 미적용)
  - → **가장 강한 리더의 집결에 좋은 병력을 참여자로 몰아넣는 것**이 데미지 최대. 이것이 운영 철학의 게임적 근거다.
- **병력 비율 메타**(참고): 세대별 궁병 몰빵. Gen1 `10/30/60` → Gen2 `10/20/70` → Gen3 `10/10/80` → Gen4+ `1/10/89`.
- **영웅**: 최상위 참여 영웅 = Chenko(첸코) / Amadeus(아마데우스) / Yeonwoo(연우) (1번 원정 스킬 치명 +25%). 보조 = Amane(아마네)/Margot/Vivian. 집결 시작 헤드는 보통 Helga.
- **"두 그룹" = 교대 웨이브(컨베이어 벨트)**: 공간 분할이 아니라 **시차를 두고 번갈아 집결을 띄워 곰을 30분 내내 끊김 없이 타격**하는 전술. 이벤트 전 웨이브 배정 필수, 집결 복귀 시 즉시 재출격. **Pitfall과 가까운(행군 짧은) 리더일수록 사이클을 더 많이 돎.**

### 우리 연맹의 실제 제약 (⚠ 매우 중요)

- **평균 보유 병력이 ~300K 수준**. 30레벨 인원만 병력이 많고, 나머지는 부족하다.
- 그래서 **27집결자는 10/10/80(궁병 몰빵)을 열면 안 된다.** 한 집결에 병력을 다 쏟으면 **다른 렐리(30메인 참여 등)에 보낼 병력이 없어진다.**
- 대부분 인원은 10/20/70 규모조차 지속하기 어렵다.
- **결론: 병력을 여러 슬롯에 쪼개 쓰기 위해 전체 비율을 `보병20 / 기병40 / 궁병40` 으로 잡는다.** (단, 30메인으로 보내는 1번 슬롯은 궁병을 더 높게)
- 즉 이 앱의 계산 본질은 "데미지 이론 최적"이 아니라 **"1인당 ~300K 병력 예산을 어떻게 쪼개 배분하는가"** 이다.
- (병력이 커지면 10/10/80으로 옮겨갈 수 있으므로 비율은 설정으로 조정 가능해야 한다.)

---

## 1. 기술 스택

- React + TypeScript
- Vite
- Tailwind CSS
- 로컬 상태만 사용 (서버 불필요)
- 모바일 반응형, 다크 톤 배경 + 카드형 UI

---

## 2. 확정된 설계 결정 (locked)

1. **그룹 = 교대 웨이브(1조/2조)**. 시차 두고 번갈아 집결. `waveOffsetSec` 설정 추가.
2. **비율은 스펙 원안 유지**: 전체 `20/40/40`, 1번 슬롯 궁병 70~80%. (메타 아님 — 병력 부족 절충. 사유는 §0)
3. 계산 프레임은 "총병력 ÷ 2 수용" 이 아니라 **"웨이브별 강한 리더 확보 + 참여 병력 커버"**.
4. 병력 비율은 설정으로 조정 가능(향후 병력 증가 대비).
5. **모바일(폰) 우선** 세로 화면 기준으로 설계. 데스크톱은 중앙 정렬로 대응.
6. **UI 텍스트는 영어가 기본(base)**. (내부 주석/설명은 한국어 유지 가능)
7. **하단 탭 3개** 네비게이션 + 메인(랜딩) 화면. 상세 §6.
8. **배치도 = 좌표 기반 스냅 격자**. 성 = 2×2 타일, 곰덫 = 4×4 타일(중앙 원점). 격자는 **45° 회전(다이아몬드/게임 도로형)** 으로 표시. 좌표계: 원점=곰덫, x 동+/서−, y 남+/북−.
9. **메인 히어로**: 랜딩은 **mp4 동영상 루프**(`src/assets/hero.mp4`, 원본 `bg_mov.mp4` → ffmpeg로 오디오 제거+압축 ~303KB). `<video autoPlay loop muted playsInline>` object-cover. 오버레이 텍스트 없음(아트에 포함). 버튼은 **하단 10%**에 배치, 라벨 **`Start` 고정**(언어 무관), 인터랙션(펄스 글로우·프레스·바운스 셰브론). 우하단 **`By. CCC Zhapa` 배지**가 원본 워터마크(Dreamina AI)를 덮음. `prefers-reduced-motion` 시 버튼 애니메이션 정지.
10. **플로우**: 인원 다중선택 → Start → 그룹1/2 계산 → 그룹 선택 → 배치 시뮬레이션(스냅 격자).
11. **빌드/배포**: `vite base:'./'`(상대경로) → 정적 호스트/서브경로 무관. 랜딩 4프레임 webp(각 ~145KB, 총 ~577KB). 배포법은 `README.md`.
12. **다국어(i18n)**: `src/i18n.tsx`에 en/ko 사전 + `LangProvider`/`useT`/`groupName`. Settings에서 언어 전환(기본 en), `settings.lang`로 저장. Guide/Slots 콘텐츠도 언어별. 채팅 복사 문구(`Copy for chat` 출력)는 연맹 공유용이라 항상 영어 유지.
13. **배치 좌표 확정**: 45명 좌표는 인게임 배치대로 `members.ts`에 박음. 좌표 export용 **Save 버튼은 숨김**(`PlacementGrid.tsx`의 `SHOW_SAVE=false`, 관리자용). 재조정 필요 시 true로 켜서 export→붙여넣기→반영.

### 열린 질문 (TBD — 추후 확정)

- [ ] 행군 시간/거리(Pitfall까지)를 리더 우선순위에 반영할지 (`marchTimeSec` 필드 후보).
- [ ] 참여자(비리더)를 명시적으로 웨이브에 배정해 보여줄지, 아니면 리더만 배정하고 참여자는 "자기 웨이브 메인에 참여" 안내로 끝낼지. (v1은 후자)
- [x] `troopsPerPlayerK` vs 수용량 관계 → **해결**: 1회 출격 행군수요(marchCapacityK) 기반 커버리지 + 사이클(§5 v2).
- [ ] 세대(Gen) 프리셋 드롭다운을 넣을지 (기본은 20/40/40 수동).

---

## 3. 데이터 모델

```ts
type Member = {
  id: string;
  name: string;
  level: number;          // 지휘부 레벨 (성 레벨 아님)
  rallyCapacityK: number; // 집결 수용량(K). 지휘부 레벨 기준. 테이블에서 직접 수정 가능해야 함.
  mainLeader: boolean;    // 30레벨 메인 집결자 여부
  supportLeader: boolean; // 서브/overflow 집결 가능 여부
  priority: number;       // 수동 우선순위 점수
  note?: string;
  marchTimeSec?: number;  // (TBD) Pitfall까지 행군 시간. 리더 사이클 보정용. 선택.
  coord: { x: number; y: number }; // 배치도 좌표. 원점=곰덫, x 동+/서−, y 남+/북−. 스냅 격자(성 2×2).
};
```

- 배치도 좌표(`coord`)는 스크린샷 기반 초기값을 시드로 넣고, 인게임 배치가 바뀌면 배치 편집기에서 드래그(스냅)로 갱신한다.

- `rallyCapacityK` 는 **성 레벨이 아니라 지휘부 레벨 기준**이며 테이블에서 **직접 수정 가능**해야 한다.
- 30레벨은 840K/960K가 섞일 수 있고, 27레벨도 지휘부가 낮으면 580K가 아닐 수 있으므로 개별 수정 필수.
- 초기 멤버 시드 데이터는 사용자가 제공한 목록을 그대로 사용한다. (별도 `members.seed.ts`)

---

## 4. 설정 (Settings)

⚠ **변경**: 원안은 UI 설정 11개 중 4개만 로직에서 쓰였다. 모든 설정을 실제 계산에 연결하거나 표시 목적임을 명시한다.

```ts
type Settings = {
  // 병력
  troopsPerPlayerK: number;     // 개인 이벤트 투입 병력(참고 표시용). 기본 250
  avgRosterK: number;           // 평균 보유 병력(참고 표시용). 기본 300
  minLeaderTroopsK: number;     // 집결자 자기 집결 최소 투입. 기본 100
  marchCapacityK: number;       // 참여자가 1회 join에 보내는 1행군 병력. 기본 100
  joinsPerLaunch: number;       // 1회 출격당 참여자가 보내는 행군 수. 기본 1
  eventMinutes: number;         // 이벤트 길이(분). 기본 30
  rallyCycleSec: number;        // 곰덫 기준 기본 집결 사이클(집결+전투+귀환) 초. 기본 300
  marchSecPerCell: number;      // 곰덫 거리 1칸당 추가 초(편도). 기본 10

  // 비율 (스펙 원안 유지)
  ratioInfantry: number;        // 기본 0.20
  ratioCavalry: number;         // 기본 0.40
  ratioArcher: number;          // 기본 0.40
  mainSlotArcherBoost: boolean; // 1번 슬롯 궁병 70~80% 강조. 기본 true

  // 웨이브(교대조)
  useWaves: boolean;            // 2개 교대 웨이브 사용. 기본 true
  waveOffsetSec: number;        // 웨이브 간 시차(초). 기본 120 (2조 = 1조 2분 뒤)

  // 서브 집결
  autoAddSupport: boolean;      // 서브 자동 추가. 기본 true
  maxSupportPerWave: number;    // 웨이브당 최대 서브 집결 수. 기본 4
  capacityBufferRate: number;   // 수용량 여유 버퍼. 기본 0.10
};
```

원안 UI 항목 매핑:
- 참여자 1인 목표 병력 250K → `troopsPerPlayerK`
- 보병/기병/궁병 목표 사용량 → **비율(`ratio*`)로 대체.** 절대값(50K/100K/100K)은 병력 규모에 따라 무의미해지므로 비율로 관리. (원하면 절대값 표시는 파생값으로 계산해 보여줄 수 있음)
- 평균 행군 수 4 / 1행군 평균 수용량 100K → **표시/참고용**(리더 사이클 안내). v1 핵심 계산엔 미사용, 미사용임을 UI에 명시.
- 집결자 최소 투입 병력 100K → `minLeaderTroopsK` (경고/안내에 사용)
- 1·2그룹 나누기 ON → `useWaves`
- 서브 집결 자동 추가 ON → `autoAddSupport`
- 그룹당 최대 서브 4 → `maxSupportPerWave`
- 수용량 여유 버퍼 10% → `capacityBufferRate`

---

## 5. 계산 로직

> **v3 조별 목표 모델 (현행 구현, 아래 v1·v2보다 우선)**
> 참여자는 1인 병력(~310K)을 **4마치 이상에 나눠** 사실상 전 병력을 렐리에 넣는다. 그래서 조는 **"오픈하면 거의 가득 차게"** 리더 수용량을 연다.
> - `contribK = troopsPerPlayerK`(기본 310), `reserveK = minLeaderTroopsK`(100)
> - 참여자를 조에 균등 분배: `groupParticipants[i]`
> - **조 목표** `groupTargetsK[i] = groupParticipants[i] × (contribK − (i>0 ? reserveK : 0))` — **2조는 1인 100K 예비**라 목표가 낮음
> - `waveCapacityK[i]` = 그 조 리더(메인+서브) rallyCapacity 합
> - `fillPct[i] = capacity / target × 100` (100% 근처 = 거의 가득), `shortageK = max(0, target − capacity)`
> - **리더 선정 = 거리+레벨**: `effThru(m) = rallyCapacityK × memberCycles(m)` (곰덫에 가깝고 수용량 큰 순). 메인은 목표 대비 부족 큰 조에, 서브는 effThru 높은 순으로 부족 큰 조에 채움(각 조 목표 도달까지, max `maxSupportPerWave`).
> - 경고: 리더로 목표 못 채우면 `warn.shortage`(집결자 추가 필요), 수용량이 목표의 135%↑면 `warn.overfill`(덜 참).
>
> **거리 기반 사이클**: `cycleSec(m) = rallyCycleSec + 2×marchSecPerCell×dist(m)`, `memberCycles = floor(eventSec / cycleSec)`. 배치도에서 리더별 `×N` 표시.
>
> (미사용: `marchCapacityK·joinsPerLaunch`는 v2 잔재 — 설정 타입엔 남아있으나 계산 미사용, SettingsPanel에선 숨김.)

### (참고) v1 웨이브 스케치

⚠ **변경 요약**
- 원안의 "우선순위 점수로 메인 밸런싱" → **수용량(rallyCapacityK) 균형**으로 변경 (병력 커버가 목적이므로).
- 서브 채우기 공유 배열 `shift()` 순차 소비 → **웨이브별 독립 풀 + 라운드로빈 성격**으로 균형화.
- **부족(shortage) 플래그**를 반환값에 추가.
- `useWaves=false` 단일 조 케이스 처리.

```ts
type Wave = { main: Member[]; support: Member[] };

type PlanResult = {
  selectedCount: number;
  totalTroopsK: number;        // 전원 투입 병력 합
  waveCount: 1 | 2;
  perWaveTroopsK: number;      // 웨이브당 커버해야 할 병력(버퍼 포함)
  waves: Wave[];               // [1조, 2조] 또는 [단일조]
  waveCapacityK: number[];     // 각 조 리더 수용량 합
  shortageK: number[];         // 각 조 부족량(>0이면 부족)
};

function buildPlan(selected: Member[], s: Settings): PlanResult {
  const waveCount = s.useWaves ? 2 : 1;
  const totalTroopsK = selected.length * s.troopsPerPlayerK;
  const perWaveTroopsK = (totalTroopsK / waveCount) * (1 + s.capacityBufferRate);

  const capOf = (ms: Member[]) => ms.reduce((n, m) => n + m.rallyCapacityK, 0);

  const mains = selected.filter(m => m.mainLeader)
    .sort((a, b) => b.rallyCapacityK - a.rallyCapacityK || b.priority - a.priority);
  const supports = selected.filter(m => !m.mainLeader && m.supportLeader)
    .sort((a, b) => b.priority - a.priority);

  const waves: Wave[] = Array.from({ length: waveCount }, () => ({ main: [], support: [] }));

  // 1) 30레벨 메인 리더를 "현재 수용량이 가장 낮은 조"에 배치 → 수용량 균형
  for (const leader of mains) {
    const idx = waves
      .map((w, i) => ({ i, cap: capOf(w.main) }))
      .sort((a, b) => a.cap - b.cap)[0].i;
    waves[idx].main.push(leader);
  }

  // 2) 서브 자동 추가: 각 조가 perWaveTroopsK 를 못 채우면 부족분 큰 조부터 라운드로빈으로 서브 투입
  if (s.autoAddSupport) {
    let guard = supports.length;
    while (guard-- > 0 && supports.length > 0) {
      // 부족량이 가장 큰(그리고 아직 max 미만) 조 선택
      const target = waves
        .map((w, i) => ({
          i,
          need: perWaveTroopsK - capOf([...w.main, ...w.support]),
          room: w.support.length < s.maxSupportPerWave,
        }))
        .filter(x => x.need > 0 && x.room)
        .sort((a, b) => b.need - a.need)[0];
      if (!target) break;
      waves[target.i].support.push(supports.shift()!);
    }
  }

  const waveCapacityK = waves.map(w => capOf([...w.main, ...w.support]));
  const shortageK = waves.map((w, i) => Math.max(0, perWaveTroopsK - waveCapacityK[i]));

  return {
    selectedCount: selected.length,
    totalTroopsK,
    waveCount,
    perWaveTroopsK,
    waves,
    waveCapacityK,
    shortageK,
  };
}
```

> 주의: `selected` / `supports` 등은 매 계산마다 원본을 파괴하지 않도록 **새 배열 복사본**으로 시작할 것.
> (원안의 `supportCandidates.shift()` 는 원본 mutate 위험이 있었음)

---

## 6. 화면 구성 (모바일 우선 · 영어 base)

전체 앱 = **랜딩(메인) + 하단 탭 3개**. 폰 세로 화면 기준.

### 6-0. Main / Landing
- 히어로 아트(제공 포스터, §2-9) 풀블리드 배경.
- 타이틀 "AAV BT1 · Bear Trap Event" (아트에 이미 포함 가능).
- 하단에 **`Start` 버튼** → 탭 1(Roster)로 진입.
- 하단 탭바 항상 노출.

**하단 탭(4개)**: `계획(Plan)` / `가이드(Guide)` / `퀵슬롯(Quick Slots)` / `계산기(Calc)`

- **`BT1 is best` 골드 배너**: 랜딩이 아니라 **Plan(Roster) 상단 sticky 헤더**에 배치.
- **애니메이션**: 리스트 항목 하단→상단 stagger(`.rise`, 22ms 간격), 탭/뷰 전환 fade(`.tabfade`, key=tab-view). `prefers-reduced-motion` 시 정지.
- **탭 4 `계산기(CalcTab)`** — 수기 플래너(자동계산 아님):
  - 보유 병종 입력(Inf/Cav/Arc × T7~T10, K) → 상단에 **남은 병종**(sticky) 표시.
  - 역할(메인/서브/일반) + 파티 수용량(기본 100K) + 슬롯 수(최대 6).
  - 각 슬롯에 **수기로 병종 K 입력** — 입력칸은 **보유한 병종만**(예: 2병종 → 2칸), **남은 양을 초과하면 자동 clamp**(최대치 못 넘음).
  - 슬롯1 = 집결자(자동), 이후 1번 영웅 = **다크 커스텀 드롭다운**(첸코/연우/아마네). 네이티브 select의 흰 배경 문제 해결.
  - 선택: `비율로 자동 채우기`(역할 비율로 프리필, 이후 수정 가능) / `비우기`. (로컬 상태, 미저장)
  - **역할 선택 위에 강조 배너**: "자신이 메인/서브/일반 중 무엇에 편성됐는지 확인" + `!` 토글 → 사용법(슬롯 최소 4·추가 가능, 보병 위주 비추천, 수기 배분, 1번 영웅 첸코/연우/아마네) 펼침.

### 6-A. 탭 1 `Plan` — Roster → Plan → Placement (핵심 플로우)
1. **Roster**: 인원 리스트. 검색 + **다중선택(체크)**. 행 = 이름 · 레벨 · 수용량(수정) · 메인/서브 가능 · 우선순위 · 메모. 모바일 큰 터치 타깃, 세로 스크롤.
2. 선택 후 **`Start`(=Calculate)** → §5 로직으로 **Group 1 / Group 2** 계산.
3. **Plan 결과**: 각 조 Main/Support 집결자, 수용량, 부족 여부, 웨이브 시차, 경고(§7).
4. 그룹(조) 선택 → **Placement Simulation**: §2-8 스냅 격자(45° 다이아몬드) 위 곰덫(4×4 중앙)+성(2×2). 스코프 탭(All/G1/G2), 역할색 + 웨이브색 링(G1 금/G2 파랑) + 리더 `×N` 사이클. `Names`(이름 항상표시)·`Reset`(배치만 초기화) 버튼. 드래그=즉시 저장.
5. (설정) 상단 또는 별도 시트에서 §4 Settings 수정. 참고용 항목은 "info" 뱃지.
6. **자동 저장**: 선택·수용량 편집·배치 좌표·설정을 `localStorage`(`aav-bt1:v1`)에 자동 저장/복원. `started`(랜딩)는 저장 안 함. Settings에 "Reset to defaults" 제공.
   - **`DATA_VERSION`**(storage.ts): 시드 명단 데이터(좌표·수용량·인원)를 코드에서 바꾸면 이 값을 올린다 → 클라이언트가 **새 명단을 채택**하되 **선택·언어 등 설정은 보존**(구 localStorage가 옛 값으로 덮어쓰는 문제 해결). `VERSION`은 저장 구조가 깨질 때만.

### 6-B. 탭 2 `Guide` — Bear Trap 설명 — *구현됨*
- 섹션: The event(**보상=개인 데미지만**, 연맹 총딜 보상 아님) / **집결을 가장 강력한 3영웅**(호스트의 모든 스탯 — 영주 장비·보석·펫·아카데미 + 영웅 장비/장비레벨/스킬레벨 전부 적용, 참여자는 병력+1영웅 1스킬만) / **Two waves · 2분 간격**(2조는 1조 2분 뒤, 집결 대기 5분 → 5:00에서 3:00 될 때 다음 조 집결) / March distance / **Our troop rule(20·40·40)** / Rules of the day.
- **하이라이트(솔리드 골드 박스)**: "보병은 절반만 — 100K면 50K만". 평균 병력 **전체 320K** 명시.

### 6-C. 탭 3 `Quick Slots`(퀵슬롯 설정) — *구현됨*
- 역할 카드 3종(Main/Support/General) × 4슬롯. **각 슬롯 = 실제 병력 K수**(예산 ~250K): 슬롯 총량 + Inf/Cav/Arc K + 비율바 + 메모.
- **궁병 절약 원칙**: 궁병은 귀하므로 **30 메인 참여 슬롯에 집중**, 나머지(자기 집결/보조)는 **기병으로 채움**(보병 대신 기병이 완충). 보병 슬롯당 ~10K·총 ~40K. 서브 집결자 slot2(자기 서브)는 20/50/30(기병 위주), slot4 예비(0K).
- **금지 규칙(빨간 박스)**: ① **첫 배치(1번 영웅) 금지** — 제이빌·조이·마린·하워드·퀸·고든·파란영웅 (다른 슬롯은 OK, 1번 원정 스킬만 적용되므로). ② **T7 미만 병종 참여 금지**. ③ 원정 스킬 낮거나 영웅 없으면 병력만.
- Roster 상단에 **레벨별 인원 대시보드**(작은 카드, 선택 인원 기준, 30=금색).

> 탭 이름(영어) 후보: `Rally` / `Bear Trap` / `Quick Slots`. 최종 명칭은 확정 필요.

### 6-4. 운영 설명 영역 (탭 1 Plan 결과 하단에 표시)
- 먼저 30레벨 메인 집결에 좋은 병력을 보내라.
- 메인이 꽉 차면 서브(overflow)에 참여하라.
- 서브 집결자는 30레벨과 경쟁하는 집결자가 아니다.
- 서브 집결자에게 최고 병력을 강제로 넣지 마라.
- 지정되지 않은 추가 집결은 열지 마라.
- 2조/서브 집결자는 자기 집결용 최소 100K(`minLeaderTroopsK`)를 남겨라.
- (게임 근거) 호스트 스탯이 집결 전체에 곱해지므로, 내 최고 병력은 가장 강한 리더에게 참여자로 보내는 게 이득.

### 6-5. 퀵슬롯 설명 영역
카드 3종: **메인 집결자 / 서브 집결자 / 일반 참여자**. 비율은 스펙 원안 유지.

**메인 집결자(30레벨)**
1. 자기 집결용 최대 데미지 — 최소 100K↑ — 보10 / 기10~20 / 궁70~80
2. 첸코 슬롯 — 다른 메인 참여/잔여 — 보20 / 기40 / 궁40
3. 연우 슬롯 — 보조 참여 — 보20 / 기40 / 궁40
4. 아마네 슬롯 — 예비 — 잔여 병력 기준

**서브 집결자(27~28레벨/보조)**
1. 30레벨 메인 참여용 — 보10 / 기10~20 / 궁70~80
2. 자기 서브 집결 오픈 — 최소 100K — 보20 / 기40 / 궁40 (overflow 처리용)
3. 첸코/연우 참여 — 보20 / 기40 / 궁40
4. 예비 — 부족하면 무리해서 보내지 않는다

**일반 참여자(집결 안 엶)**
1. 30레벨 메인 전용 — 최고 병력 — 보10 / 기10~20 / 궁70~80
2. 첸코 슬롯 — 보20 / 기40 / 궁40
3. 연우 슬롯 — 보20 / 기40 / 궁40
4. 아마네 슬롯 — 잔여 병력 기준

**공통 안내**
- 보병을 0으로 만들 필요 없다. 다만 보병 100K를 전부 보내지 않는다(약 50K만).
- 목표 전체 비율 ≈ 보20 / 기40 / 궁40. 단 30메인行 1번 슬롯은 궁병 비율을 더 높게.
- (참고) 병력이 커지면 궁병 비중을 10/10/80 쪽으로 올릴 수 있다. Amadeus(참여 최상위)·Helga(집결 시작)도 활용.

---

## 7. 경고 (concrete thresholds)

⚠ **변경**: 원안의 애매한 임계값을 구체화.

1. **30레벨 메인 ≤ 2명** → "30레벨 메인 집결자가 부족합니다. 서브 집결 비중이 커질 수 있습니다."
2. **한 웨이브의 집결 수(메인+서브) > 6** → "집결 수가 많아 참여자가 헷갈릴 수 있습니다. 메인 집결 우선 규칙을 강조하세요." (임계값은 `maxSupportPerWave`와 연동, 설정화 가능)
3. **서브 수용량이 그 웨이브 총 수용량의 40% 초과** → "서브 집결이 많아졌습니다. 좋은 병력이 서브로 먼저 들어가지 않게 안내가 필요합니다."
4. **선택 인원 ≤ 20명** → "참여자가 적습니다. 서브 집결을 줄이고 메인 집결 중심으로 운영하세요."
5. **`shortageK[i] > 0`** → "N조 리더 수용량이 부족합니다. 서브 집결을 추가하거나 인원을 조정하세요." (원안엔 없던 부족 감지)

---

## 8. 복사 버튼

연맹 채팅용. 예시:

```
[Bear Trap Rally Plan]
Wave 1 (start T+0): Main — CCC Zhapa, KOREA | Support — Sweetie, MiaLamb
Wave 2 (start T+60s): Main — CCC Eirene, Rockramy | Support — Andemoti, Keniapll
Send your best troops to the 30-level main rallies first. If a main rally is full, join a support rally.
Support rallies are for overflow only. Do not open extra rallies unless R4 asks.
Wave 2, keep at least 100K for your own rally.
```

- 웨이브/시차를 문구에 반영.
- 특수문자 이름(`○○●Morillo●○○`, `쁘◇VANGUARD◇쁘`)은 그대로 출력하되 복사 정상 동작 확인.

---

## 9. 디자인

- 카드형 UI, 다크 톤.
- 메인 집결자 = 노란색/강조. 서브 집결자 = 회색/파랑 보조색.
- 참여자 테이블 스크롤, 결과 영역은 한눈에.
- 모바일에서 체크·수치 수정 쉬움.

---

## 10. 원안 대비 수정 사항 로그

- **그룹 → 교대 웨이브** 재정의 (게임 정석). `waveOffsetSec` 추가.
- **메인 밸런싱: 우선순위 점수 → 수용량 기준** (예시 출력과 알고리즘 불일치 해소).
- **서브 채우기 균형화** + 웨이브별 max 적용, 원본 배열 mutate 방지.
- **부족(shortage) 감지/경고 추가**.
- **경고 임계값 구체화**(2·3번).
- **미사용 설정 정리**: 비율(ratio)로 통합, 참고용 항목 명시.
- **비율은 원안 유지**하되 *병력 부족 절충*이라는 근거를 문서화(§0).
- 퀵슬롯에 Amadeus/Helga 참고 추가.
- `single wave(useWaves=false)` 케이스 처리.
```
