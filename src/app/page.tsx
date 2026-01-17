'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { IntroSplash } from '@/components/IntroSplash';
import { NavFooter } from '@/components/NavFooter';
import { MobileSite } from '@/components/MobileSite';
import { InfoOverlay, ArticleOverlay } from '@/components/InfoSection';
import { useIsMobile } from '@/lib/useIsMobile';

type Category = 'all' | 'motion' | 'stills' | 'research';
type ViewMode = 'carousel' | 'grid';

type MediaItem = {
  src: string;
  type: 'image' | 'video';
  isLandscape?: boolean; // true = 16:9 landscape frame, false/undefined = 4:5 portrait frame
  vimeoId?: string; // Vimeo video ID for production streaming
  process?: string; // Process tag: "In-Camera", "AI Still", "AI Motion", "Iterative Render", etc.
};

type Project = {
  id: string;
  title: string;
  media: MediaItem[];
  priority?: number; // Higher number = shown first, undefined = random order after priority items
};

type InfoItem = { title: string; content: string; isEmail?: boolean };

type ArticleItem = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  content: string[];
};

// Writing/Articles content - each article displays as overlay like Practice
const WRITING_CONTENT: ArticleItem[] = [
  {
    slug: 'what-clients-actually-ask-about-ai',
    title: 'What Clients Actually Ask About AI',
    subtitle: 'The questions that determine whether we move forward',
    date: '2025',
    content: [
      `I've been in a lot of these meetings lately, and there's a pattern. There's genuine curiosity. They've seen the demos, they know things are moving fast. The questions that actually determine whether we move forward aren't about capability anymore. They're about workflow, consistency, and whether we can deliver what they need, when they need it.`,
      `The first question is almost always some version of: can you match this closely enough? They'll have a key visual, a specific look. Not "can AI make something beautiful." They assume that. Can it make this. Consistently. At the level we need for a global campaign.`,
      `The answer, increasingly, is yes.`,
      `AI has matured past the demo reel stage. The tools now allow for precise control — consistent lighting, repeatable setups, exact asset matching across deliverables. What used to require a full studio build can now be directed through iterative refinement. Same craft principles. Different execution.`,
      `The second question is about predictability. What should we expect from the workflow?`,
      `This is where trust gets built. Clients aren't looking for magic. They're looking for a process they can manage. What they need is someone who understands both the creative direction and the technical pipeline — someone who can speak their language.`,
      `What I've found works is documentation. Keep records of which models, which versions, which prompts. Maintain project files so assets can be recreated and refined. Structure the workflow so revisions are fast and variations are efficient. This gives clients something concrete. Something they can put in a deck and defend to their boss.`,
      `The mistake I see most often is leading with novelty. Here's what AI can do, look at these amazing examples, imagine the possibilities.`,
      `That's the wrong frame. It makes AI sound like magic, and magic makes producers nervous. Magic means they don't understand how it works, which means they can't manage it.`,
      `The better frame is craft. AI as an extension of the craft you already do. Another tool alongside motion control rigs and macro lenses and CG augmentation. The strengths are real: speed, variation, exploration, and increasingly, precision. You choose when to use it based on what the project needs.`,
      `This means talking like a producer, not an evangelist. Costs and timelines. Deliverable formats. Revision rounds. The operational details that actually determine whether something ships successfully.`,
      `When I talk this way, clients relax. They're not being sold a mystery. They're being offered a workflow they can understand and manage. That's what moves projects forward.`,
    ],
  },
  {
    slug: 'the-studio-or-the-screen',
    title: 'The Studio or the Screen',
    subtitle: 'The tension I sit with every day',
    date: '2025',
    content: [
      `I love being in a studio with lights to move and people to direct. But I've also learned to value what the screen makes possible.`,
      `The question is which one fits the job.`,
      `That's the honest position. Not a prediction, not a stance, not a vision of the future. Just the tension I sit with every day, and the tension I suspect anyone working in commercial image-making sits with too.`,
      `On one side: the studio. Real materials, real physics, real people making decisions in real time. The creative energy that comes from a shared space. Clients love being there. Agencies love the collaboration. There's something in the pace of a physical shoot that no screen can replicate.`,
      `On the other side: the screen. Speed, efficiency, infinite iteration. The ability to explore fifty directions before lunch. Budgets shrinking, markets tightening, clients asking harder questions about costs. The pressure to deliver more for less, faster.`,
      `I don't know which side wins. I'm not sure anyone does.`,
      `The public conversation is still catching up. Some AI work gets criticised for feeling hollow. But the issue isn't the tool — it's the direction. AI without craft knowledge produces generic results. AI with craft knowledge produces work that holds up.`,
      `The difference is in who's directing it, and what they bring to the process.`,
      `Light and material and precision — that's where AI excels when guided by someone who understands the physics. Human connection and narrative warmth require a different kind of attention. Knowing which approach fits which brief is part of the job.`,
      `The question isn't whether AI can make an image. It's what the image is actually about, and whether AI serves that.`,
      `The opportunity is clear: these tools extend what's possible. More exploration, faster iteration, broader range. The craft challenge is making AI work invisible — outputs that feel considered, not generated.`,
      `That's the position luxury brands are navigating. It's the position a lot of us are navigating.`,
      `I keep coming back to the same question: what happens to the room? The room is where the craft lives. It's where materials behave, where light does what light does, where people make decisions together. It's slow and expensive and irreplaceable.`,
      `The screen is where the range lives. It's fast, iterative, and expansive. The outputs can match the room when the direction is right. The process is different, not lesser.`,
      `I value both. That's the honest answer. And I'm building craft that works in either context, because the best work will come from knowing when to use which.`,
      `The directors who survive this will be the ones who can work both sides. Not by abandoning craft, but by figuring out how to channel it through new tools. The job becomes taste, judgment, direction — knowing what to ask for and recognising when you've got it.`,
      `That's not a small thing. It might be the whole thing.`,
    ],
  },
  {
    slug: 'how-i-direct-ai-like-a-shoot',
    title: 'How I Direct AI Like a Shoot',
    subtitle: 'The craft memory lives in the director, not the tool',
    date: '2025',
    content: [
      `Each AI session starts fresh. It doesn't carry forward what worked yesterday, which lighting logic solved the problem, or why the frost looked right on take twelve but wrong on take eleven.`,
      `This is actually how I prefer to work. Every session is a clean slate, shaped entirely by what I bring to it.`,
      `The craft memory has to live somewhere. If it can't live in the tool, it lives in the process. In the reference library. In the iteration loop. In the decisions I make before the prompt is written.`,
      `This is what I mean when I say I direct AI the way I'd direct a shoot.`,
      `On a real set, nobody expects the camera to remember the last job. You don't walk in and assume the lights are already positioned, the product already placed, the background already built. You bring the brief, the references, the accumulated knowledge of what works for this kind of material, this kind of light, this kind of story.`,
      `AI is no different. The difference is speed, not structure.`,
      `What I bring to each session: a reference folder, a prompt architecture, a clear sense of the material behaviour I'm after. The tool provides the rendering. I provide the continuity.`,
      `The iteration loop is where the directing happens.`,
      `First generation is almost never right. It's a sketch, a direction, a starting point. The question isn't whether it matches what I imagined. The question is whether it contains something worth developing.`,
      `I look for the physics first. Is the light behaving? Are the reflections landing in places that make sense? Does the material have the weight and texture it should? If the fundamentals are wrong, no amount of refinement will fix it.`,
      `When something works, I pull it into the reference stack. That image becomes part of the brief for the next round. This is how consistency builds. Not through the model remembering, but through me feeding back what's working.`,
      `Reference is the bridge between sessions.`,
      `Every project starts with a reference folder. Some of it is my own work. Some is photography I admire. Some is AI output from previous rounds that landed correctly.`,
      `The folder isn't just inspiration. It's a physics library. When I need frost that grows from an origin point and spreads along surface contours, I have images that show exactly that. When I need gel with the right refractive tension, I have references where the light bends correctly.`,
      `The AI responds beautifully to visual reference. Show it an image of frost doing exactly what you need, and it understands.`,
      `I think of prompts as direction notes, not magic spells.`,
      `A prompt that says "beautiful frost on a bottle" is a starting point. But craft-informed prompting goes further.`,
      `A prompt that says "frost crystals originating from the base edge, spreading upward along the surface, denser on the matte zones, sparser on the polished glass" gives the model behaviour to follow. It's still interpolating from its training data, but now it has constraints.`,
      `The constraints come from craft knowledge. What frost actually does. How light actually falls. Where reflections actually land.`,
      `Consistency isn't automated. It's accumulated.`,
      `Over the course of a project, I build a small archive: the prompts that worked, the references that aligned, the outputs that hit the physics correctly. This becomes the project's memory.`,
      `When I need a variant, I don't start from scratch. I start from the archive. Same prompt structure, same reference stack, adjusted for the new angle or material or lighting condition.`,
      `The tool doesn't carry this forward. I do. But the result is the same: consistency across deliverables, built through process rather than through features.`,
      `There's a rhythm to this that feels familiar if you've ever been on set.`,
      `You try something. You look at the result. You adjust. You try again. You notice what's working and lean into it. You notice what's failing and change the approach.`,
      `The difference is compression. On set, that loop might take hours. With AI, it takes minutes. But the thinking is the same: observe, diagnose, adjust, iterate.`,
      `The speed doesn't change the craft. It changes where the craft decisions happen.`,
      `What I've learned is that the limitation is also the freedom.`,
      `Because the tool doesn't remember, I'm not fighting accumulated drift. Every session starts clean. The constraints I bring are the ones I choose.`,
      `This means I can evolve the look mid-project if something better emerges. I can shift direction without untangling what the model thinks it learned. I can hold the creative thread because I'm the one holding it, not the software.`,
      `The craft memory lives in the director. That's not a workaround. That's the job.`,
    ],
  },
  {
    slug: 'real-frames-generated-motion',
    title: 'Real Frames, Generated Motion',
    subtitle: 'Why physical captures create a licensing trail AI alone cannot provide',
    date: '2025',
    content: [
      `The first time I watched the Creed footage back, I couldn't tell which shots were real and which were generated.`,
      `That was the point.`,
      `But the reason we shot real bookends wasn't about control. AI video has come far enough that control isn't the problem. The physics in current models are genuinely good now. You can direct motion, maintain material behaviour, get results that hold up.`,
      `The reason we shot real bookends was ownership.`,
      `When you generate video from a prompt alone, the licensing question gets complicated fast.`,
      `Who owns it? What's the creative origin? If a client wants to run the footage globally for three years, what exactly are they licensing? The prompt? The output? The model's interpolation of its training data?`,
      `Luxury brands ask these questions. Legal teams ask these questions. And right now, there aren't clean answers.`,
      `When you shoot real frames on set, there's a trail. I own the captures. The creative decisions are documented. The AI becomes a tool that extends what I made, not the source of the work itself.`,
      `That distinction changes the conversation entirely.`,
      `The Creed project started the way most of my work starts now: real captures on set. A bottle of Silver Mountain Water. Golden liquid poured practically. Light catching the material exactly how it should.`,
      `We shot the beginning state. We shot the end state. The AI's job was to bridge them.`,
      `Because the bookends exist in physical space, the provenance is clear. The footage isn't generated from nothing. It's generated from my captures, through my process, under my direction.`,
      `This isn't about whether AI can produce good results. It can.`,
      `The physics-aware models have matured. You can get motion that feels grounded, that respects how liquids move and how light bends and how frost spreads.`,
      `But capability and licensability are different questions.`,
      `A prompt typed into a box doesn't create a defensible ownership trail. A crafted process does. Reference stacks, physics-aware prompting, iteration loops, documented methodology. When you can show how the image was made, who made the creative decisions, and what source material anchored it, you have something that can be licensed properly.`,
      `The methodology matters.`,
      `Master prompts with derivatives to keep the language consistent across every generation. A tight subset of the real captures fed into the pipeline to ground the AI's understanding of the material.`,
      `The training gave it enough reference to maintain viscosity, colour temperature, highlight behaviour. When the animation pass came, it stayed true to what we'd built on set.`,
      `A lot of generations before it looked right. Each round fed back into the next until the physics aligned. That iteration is part of the craft. It's documented. It's directed.`,
      `For luxury clients, this is the difference that matters.`,
      `They're not asking whether AI can make beautiful footage. They assume it can. They're asking whether they can use it. Whether the rights are clear. Whether there's exposure they haven't thought of.`,
      `When you can show the process, the creative decisions, the iteration, the reference architecture, the documentation, the conversation moves forward. The work becomes licensable because the craft is visible.`,
      `The hybrid workflow is where this lands.`,
      `Real captures for the anchor points. AI for the transitions, variants, extensions. The shoot establishes the physics and the ownership. The AI multiplies the output.`,
      `This isn't about AI being unreliable. It's about building a process that luxury brands can actually license. A trail they can point to. Documentation that holds up.`,
      `The craft isn't just in making the image look right. It's in making the image defensible.`,
    ],
  },
  {
    slug: 'what-changes-when-ai-learns-physics',
    title: 'What Changes When AI Learns Physics',
    subtitle: 'The questions worth sitting with',
    date: '2025',
    content: [
      `The models are getting better at understanding the world.`,
      `Not just imitating it. Understanding it. The difference matters. A model that imitates liquid splashing places droplets where they statistically appear in training images. A model that understands liquid knows how viscosity affects motion, how surface tension shapes the edge, how gravity pulls the mass downward over time.`,
      `We're already seeing this emerge. And the progress is accelerating faster than most people expect.`,
      `Current models interpolate. They've seen millions of images, learned the statistical relationships between pixels, and when you prompt them they walk backwards through that learned space to produce something plausible.`,
      `The next generation reasons. They build internal models of how objects behave, how light travels, how materials respond to force. They simulate rather than recombine.`,
      `When that shift completes, a lot of what I've written about process and methodology becomes less necessary. If the model understands physics, you don't need to teach it through reference and iteration. You just describe what you want.`,
      `I don't know when that happens. Could be two years. Could be five. Could be longer if the current architectures hit limits that require fundamental rethinking.`,
      `But I watch the trajectory, and the trajectory is clear.`,
      `What stays human when the tools understand physics?`,
      `Taste. The model can simulate condensation beading on glass. The director decides whether that moisture is right for this brand, this campaign, this moment. The sensory tension that makes the image resonate — that's a human call. The model executes. The director decides.`,
      `Narrative. The model can generate a sequence of frames. The director understands why this shot follows that shot, why the pacing matters, why the viewer needs a breath before the reveal. Story remains human territory.`,
      `Judgment. The model can produce a hundred variations. Someone has to choose. Someone has to know when to stop iterating, when the image is done, when good enough is actually good enough. That's direction, not automation.`,
      `The social dimension doesn't disappear either.`,
      `Clients like being in the room. Agencies like the energy of a shoot. There's something in the collaboration, the real-time decision-making, the shared experience of building something together that no screen workflow replicates.`,
      `The energy of a physical set — the shared decisions, the real-time problem solving — that doesn't disappear just because the tools improve.`,
      `And yet, economics matter. Clients want more output, faster turnaround, tighter budgets. The pressure to deliver without a full production is real and growing.`,
      `The practitioners who thrive will be fluent in both. Physical production when the job needs presence and collaboration. Screen work when it needs speed and range.`,
      `The balance keeps shifting. No one knows where it settles.`,
      `The tools will keep improving. That's certain.`,
      `Physics-aware generation. Persistent memory across sessions. Models that learn your aesthetic and carry it forward. All of this is coming, in some form, on some timeline.`,
      `What I'm less certain about is what it means for the work.`,
      `Does better AI mean fewer shoots? Probably some. Does it mean the end of physical production? I doubt it. The room has value that efficiency can't replace. But the balance will shift. It's already shifting.`,
      `The honest position is uncertainty.`,
      `I sit with the tension every day. The studio or the screen. The room or the render. I have preferences, but preferences don't determine outcomes. Markets do. Clients do. The slow accumulation of decisions across thousands of projects does.`,
      `What I can control is being ready for both. Building craft that works on set and craft that works on screen. Understanding the tools well enough to direct them. Staying close enough to the physics that when the models finally understand it too, I'm still the one deciding what to make.`,
      `The question isn't whether AI will change the work. It already has. The question is what remains essential when the tools catch up.`,
      `I think it's the eye. I think it's the decision. I think it's the human rhythm of trust and creative exchange that no model replicates.`,
      `But I'm watching. We all are.`,
    ],
  },
  {
    slug: 'what-glass-knows-about-light',
    title: 'What Glass Knows About Light',
    subtitle: 'The difference between AI that looks expensive and AI that feels expensive is usually one material behaving wrong.',
    date: '2025',
    content: [
      `Most AI images fail at the same moment: the light hits the surface and does the wrong thing.`,
      `A whisky bottle glows from within but throws no caustics on the table. A gold cap reflects a studio that doesn't exist. Condensation appears on the inside of a glass that's supposed to be cold on the outside. These aren't style choices. They're physics errors dressed up as aesthetics.`,
      `I spend more time thinking about how materials behave than I do about composition or color. Because materials aren't decoration—they're the grammar of believable images. Get the grammar wrong and every sentence sounds broken, even if the words are beautiful.`,
      `Frosted glass diffuses light. It softens what passes through it and creates a glow at the edges. Polished crystal does the opposite—it fragments light into sharp caustics and throws prismatic colors onto nearby surfaces. Same category, completely different behavior. If you don't know which one you're working with, you can't light it correctly.`,
      `This is where most AI work goes wrong. The image looks technically impressive but feels synthetic. The viewer can't articulate why, but something registers as off. Usually it's because three materials are all responding to light the same way—as if the scene were made of one substance with different textures painted on.`,
      `When I approach a brief, I start with the product itself. What is this made of? How does each material respond to light? A perfume bottle might combine polished crystal, brushed gold, and a liquid that needs backlighting to show its color. Three materials, three different lighting requirements, all in one object. The image only works when each element behaves according to its nature.`,
      `Amber spirits glow when you backlight them—the liquid acts like a filter, warming everything that passes through. Chrome reflects whatever you put in front of it, so you're really photographing the environment, not the metal. Leather absorbs light and reveals its texture under a raking angle. Marble, at thin edges, actually transmits light and glows slightly.`,
      `These aren't secrets. Anyone who's spent time in a studio knows them. The question is whether you can translate that knowledge into language a generative model understands—and whether you care enough to try.`,
      `The difference between AI imagery that reads as stock and AI imagery that reads as campaign often comes down to this kind of attention. Not just prompting for "luxury" or "premium" but understanding the specific physics that create that impression. Light wrapping around a curved surface. Condensation rolling down glass in the direction gravity actually pulls. Reflections that match a plausible environment rather than an impossible one.`,
      `I'm not suggesting every frame needs documentary accuracy. Photography has always been about controlled reality—shaping light, refining surfaces, pushing color into emotional territory. But the choices need internal consistency. The physics within the frame have to agree with each other.`,
      `When I work with AI, I'm essentially directing materials. Telling them how to catch light, where to throw shadows, what imperfections they're allowed to show. A fingerprint on metal. An uneven bead of condensation. Micro-scratches that prove a surface exists in the physical world. These details are what separate imagery that feels manufactured from imagery that feels captured.`,
      `The craft isn't about making things look perfect. It's about making them look real in the right way. And that starts with understanding what each material knows about light.`,
    ],
  },
];

// Methodology content to display in frames (4 sections)
const INFO_CONTENT: InfoItem[] = [
  { title: 'We start with an idea. Not a tool.', content: 'Every project begins with a concept, a product truth, and a visual direction. The method comes second.\n\nOur background is still life and tabletop production. 15 years working with light, materials, motion, and control. That craft doesn\'t disappear in AI. It becomes the framework that guides it.\n\nThis isn\'t learned from tutorials. It\'s 15 years on set.' },
  { title: 'Concept, Then Movement', content: 'Stills and motion aren\'t separate offerings. They\'re format choices.\n\nA moment unfolding. A product revealed. An atmosphere built over time.\n\nSometimes that\'s a single frame. Sometimes it\'s motion. Often it\'s both. The language stays the same. Only the format changes.' },
  { title: 'Directed, Not Automated', content: 'Nothing here is one-click. Nothing is left unattended.\n\nImages and motion are shaped through reference, iteration, and adjustment. The same way a shoot evolves.\n\nAI responds to direction. It doesn\'t replace it.' },
  { title: 'Craft at Speed', content: 'AI is fast. That\'s not the hard part.\n\nThe hard part is fast work that doesn\'t look fast. Production that could have been shot but wasn\'t.\n\nBut speed isn\'t the point. It\'s the space to think properly. Concepts sketched, tested, rebuilt. Environments that never made sense to build. Combinations that wouldn\'t exist on a real set.\n\nNot just generation. Direction. Not just speed. Craft and range.' },
];

// Contact content for single frame
const CONTACT_CONTENT = {
  title: 'Contact',
  email: 'hello@hofman.studio',
  instagram: '@Hofman/studio'
};

// Work projects with grouped media
// isLandscape: true for 16:9 aspect ratio, false/undefined for 3:4 portrait
const WORK_PROJECTS: Project[] = [
  {
    id: 'horlogerie',
    title: 'Horlogerie',
    media: [
      { src: "/images/Watch report/freepik__enhance__46843.jpg", type: "image" as const, isLandscape: false, process: "AI Still" },
      { src: "/images/Watch report/freepik__enhance__73551.jpg", type: "image" as const, isLandscape: false, process: "AI Still" },
      { src: "/images/Watch report/freepik__enhance__83979.jpg", type: "image" as const, isLandscape: false, process: "AI Still" },
      { src: "/images/Watch report/freepik__enhance__83980.jpg", type: "image" as const, isLandscape: false, process: "AI Still" },
    ],
  },
  {
    id: 'wild-rose',
    title: 'Wild Rose',
    media: [
      { src: "/videos/Wild rose/2026-01-07T20-41-29_top_down_shot__.mp4", type: "video" as const, isLandscape: true, vimeoId: "1154688609", process: "AI Motion" },
      { src: "/videos/Wild rose/kling_25_turbo_oil_drip_orbit_213420.mp4", type: "video" as const, isLandscape: true, vimeoId: "1154688545", process: "AI Motion" },
      { src: "/videos/Wild rose/kling_25_turbo_oil_drip_orbit_094147.mp4", type: "video" as const, isLandscape: true, vimeoId: "1154688574", process: "AI Motion" },
      { src: "/videos/Wild rose/2026-01-07T21-52-22_luma_prompt__.mp4", type: "video" as const, isLandscape: true, vimeoId: "1154688635", process: "AI Motion" },
    ],
  },
  {
    id: 'merit',
    title: 'Merit Beauty',
    media: [
      { src: "/images/Merit/freepik__enhance__74134.jpg", type: "image" as const, isLandscape: false, process: "Iterative Render" },
      { src: "/images/Merit/SH_t9w9cp.jpg", type: "image" as const, isLandscape: false, process: "AI Still" },
    ],
  },
  {
    id: 'gucci',
    title: 'Gucci Beauty',
    priority: 1, // Featured project - appears first
    media: [
      { src: "/images/Gucci Chrome absurdist/SH_Chrome_Absurdist_GucciSH_Nano_Packaging_00132_-standard v2-4x.jpg", type: "image" as const, isLandscape: false, process: "Iterative Render" },
      { src: "/images/Gucci Chrome absurdist/SH_Gucci_Master s2.jpg", type: "image" as const, isLandscape: false, process: "AI Still" },
    ],
  },
  {
    id: 'abstracts',
    title: 'Abstracts',
    media: [
      { src: "/videos/Asbstracts/SH_Sisley_Animation.mp4", type: "video", isLandscape: false, vimeoId: "1154689508", process: "AI Motion" },
      { src: "/videos/Asbstracts/SH_SAB_Motion_02.mp4", type: "video", isLandscape: false, vimeoId: "1154689448", process: "AI Motion" },
      { src: "/videos/Asbstracts/a_precise_tabletop_macro_composition_of_a_brushed_steel_audemars_piguet_chronograph_resting_on_a_se_5rjxgwuz6vjkyw0wq84x_1.mp4", type: "video", isLandscape: false, vimeoId: "1154688746", process: "AI Motion" },
      // NOTE: .mov files don't work in browsers - convert to .mp4 to re-enable
      // { src: "/videos/Asbstracts/Professional_Mode_Camera_is_locked__A_transparent__4_chf3_prob4.mov", type: "video", isLandscape: false, vimeoId: "1154688698", process: "AI Motion" },
    ],
  },
];

// Shuffle array with a seed (consistent per session)
const shuffleArray = <T,>(array: T[], seed: number): T[] => {
  const shuffled = [...array];
  let currentIndex = shuffled.length;

  // Simple seeded random
  const seededRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  while (currentIndex > 0) {
    const randomIndex = Math.floor(seededRandom() * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }

  return shuffled;
};

// Sort projects: priority items first (by priority desc), then shuffle the rest
const getOrderedProjects = (projects: typeof WORK_PROJECTS, seed: number) => {
  const priorityProjects = projects
    .filter(p => p.priority !== undefined)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  const nonPriorityProjects = projects.filter(p => p.priority === undefined);
  const shuffledNonPriority = shuffleArray(nonPriorityProjects, seed);

  return [...priorityProjects, ...shuffledNonPriority];
};

// Research projects - separate content for research tab
// Add your research images/videos here
const RESEARCH_PROJECTS: Project[] = [
  // Example structure - add your research content here:
  // {
  //   id: 'material-study',
  //   title: 'Material Study',
  //   media: [
  //     { src: "/images/research/study1.jpg", type: "image", isLandscape: false },
  //   ],
  // },
];

export default function Home() {
  const { isMobile, isLoaded } = useIsMobile();
  const [showIntro, setShowIntro] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('carousel');
  const [showInfo, setShowInfo] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showWriting, setShowWriting] = useState(false);
  const [visibleFrameIndices, setVisibleFrameIndices] = useState<number[]>([]);
  const [contactFrameIndex, setContactFrameIndex] = useState<number | null>(null);
  const [writingFrameIndices, setWritingFrameIndices] = useState<number[]>([]);
  const [expandedMedia, setExpandedMedia] = useState<{
    item: MediaItem;
    projectTitle: string;
    globalIndex: number;
  } | null>(null);
  const [returnToGrid, setReturnToGrid] = useState(false); // Track if we should return to grid after closing info/contact
  const [isTransitioning, setIsTransitioning] = useState(false); // Track view mode transition
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const animationRef = useRef<number | null>(null);

  // Generate a random seed once per session for consistent ordering
  const [sessionSeed] = useState(() => Math.floor(Math.random() * 10000));

  // Get randomized projects with priority items first
  const orderedProjects = useMemo(() => getOrderedProjects(WORK_PROJECTS, sessionSeed), [sessionSeed]);

  // Filter projects based on category (uses randomized order)
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'research') return RESEARCH_PROJECTS;
    if (activeCategory === 'all') return orderedProjects;

    return orderedProjects.map(project => ({
      ...project,
      media: project.media.filter(item =>
        activeCategory === 'motion' ? item.type === 'video' : item.type === 'image'
      )
    })).filter(project => project.media.length > 0);
  }, [activeCategory, orderedProjects]);

  // Reset scroll position when category changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [activeCategory]);

  // Handle category change - close info/contact/writing and change category
  const handleCategoryChange = (category: Category) => {
    if (showInfo) setShowInfo(false);
    if (showContact) setShowContact(false);
    if (showWriting) {
      setShowWriting(false);
    }
    setActiveCategory(category);
  };

  // Handle view mode change - close info/contact/writing and crossfade when switching views
  const handleViewModeChange = (mode: ViewMode) => {
    if (showInfo) setShowInfo(false);
    if (showContact) setShowContact(false);
    if (showWriting) {
      setShowWriting(false);
    }
    // Trigger crossfade transition
    setIsTransitioning(true);
    setTimeout(() => {
      setViewMode(mode);
      // Use requestAnimationFrame for smoother paint timing
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(false);
        });
      });
    }, 600); // Duration matches CSS transition-opacity-smooth
  };

  // Get all media items flattened with their global indices (uses randomized order)
  const allMediaItems = useMemo(() => {
    const items: { globalIndex: number; isLandscape: boolean }[] = [];
    let index = 0;
    orderedProjects.forEach(project => {
      project.media.forEach(item => {
        items.push({ globalIndex: index, isLandscape: item.isLandscape || false });
        index++;
      });
    });
    return items;
  }, [orderedProjects]);

  // Helper to get frame indices for info display
  // Select frames to cover all info sections (landscape = 2 sections, portrait = 1)
  const getFrameIndicesForInfoCount = (infoCount: number): number[] => {
    if (allMediaItems.length === 0) return [0, 1, 2, 3].slice(0, infoCount);

    const framesToUse: number[] = [];
    let sectionsUsed = 0;

    // Go through media items in order, adding frames until we have enough sections
    for (const mediaItem of allMediaItems) {
      if (sectionsUsed >= infoCount) break;
      framesToUse.push(mediaItem.globalIndex);
      sectionsUsed += mediaItem.isLandscape ? 2 : 1;
    }

    return framesToUse;
  };

  // Function to detect visible frames and toggle info mode
  const handleInfoToggle = () => {
    if (!showInfo) {
      // Close contact and writing if open (mutually exclusive)
      if (showContact) {
        setShowContact(false);
      }
      if (showWriting) {
        setShowWriting(false);
      }
      // If in grid mode, crossfade to carousel and mark to return
      if (viewMode === 'grid') {
        setReturnToGrid(true);
        setIsTransitioning(true);
        // Use random frames for info display when coming from grid
        setVisibleFrameIndices(getFrameIndicesForInfoCount(INFO_CONTENT.length));
        setTimeout(() => {
          setViewMode('carousel');
          setShowInfo(true);
          // Reset scroll to 0 so content starts at left edge (no extra padding)
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 0;
          }
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setIsTransitioning(false);
            });
          });
        }, 600);
      } else {
        // In carousel mode, select the most CENTRAL visible frames for info overlay
        // Portrait frames show 1 section, landscape frames show 2 sections
        const container = scrollContainerRef.current;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const containerCenter = containerRect.left + containerRect.width / 2;

          // Find all visible frames with their distance from center
          const visibleFrames: { index: number; isLandscape: boolean; distanceFromCenter: number }[] = [];

          frameRefs.current.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            const mediaItem = allMediaItems.find(m => m.globalIndex === index);
            // Check if frame is at least partially visible
            if (rect.right > containerRect.left && rect.left < containerRect.right) {
              const frameCenter = rect.left + rect.width / 2;
              visibleFrames.push({
                index,
                isLandscape: mediaItem?.isLandscape || false,
                distanceFromCenter: Math.abs(frameCenter - containerCenter)
              });
            }
          });

          // Sort by distance from center (most central first)
          visibleFrames.sort((a, b) => a.distanceFromCenter - b.distanceFromCenter);

          // Select frames starting from center until we have enough sections
          const framesToUse: number[] = [];
          let sectionsUsed = 0;

          for (const frame of visibleFrames) {
            if (sectionsUsed >= INFO_CONTENT.length) break;
            framesToUse.push(frame.index);
            sectionsUsed += frame.isLandscape ? 2 : 1;
          }

          // If we don't have enough visible frames, add adjacent frames
          if (sectionsUsed < INFO_CONTENT.length) {
            const allFrameIndices = allMediaItems.map(m => ({ index: m.globalIndex, isLandscape: m.isLandscape }));
            const usedIndices = new Set(framesToUse);

            // Get the range of used frames
            const minUsed = Math.min(...framesToUse);
            const maxUsed = Math.max(...framesToUse);

            // Alternate between adding frames after and before
            let addAfter = true;
            while (sectionsUsed < INFO_CONTENT.length) {
              const nextAfter = allFrameIndices.find(f => f.index > maxUsed && !usedIndices.has(f.index));
              const nextBefore = [...allFrameIndices].reverse().find(f => f.index < minUsed && !usedIndices.has(f.index));

              const frameToAdd = addAfter ? (nextAfter || nextBefore) : (nextBefore || nextAfter);
              if (!frameToAdd) break;

              framesToUse.push(frameToAdd.index);
              usedIndices.add(frameToAdd.index);
              sectionsUsed += frameToAdd.isLandscape ? 2 : 1;
              addAfter = !addAfter;
            }
          }

          // Sort final list by index for consistent display order
          framesToUse.sort((a, b) => a - b);
          setVisibleFrameIndices(framesToUse);
        }
        setShowInfo(true);
      }
    } else {
      // Closing info - return to grid if we came from there
      if (returnToGrid) {
        setIsTransitioning(true);
        setShowInfo(false);
        setTimeout(() => {
          setReturnToGrid(false);
          setViewMode('grid');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setIsTransitioning(false);
            });
          });
        }, 600);
      } else {
        setShowInfo(false);
      }
    }
  };

  // Function to detect most central visible frame and toggle contact mode
  const handleContactToggle = () => {
    if (!showContact) {
      // Close info and writing if open (mutually exclusive)
      if (showInfo) {
        setShowInfo(false);
      }
      if (showWriting) {
        setShowWriting(false);
      }
      // If in grid mode, crossfade to carousel and mark to return
      if (viewMode === 'grid') {
        setReturnToGrid(true);
        setIsTransitioning(true);
        // Use first frame for contact display when coming from grid
        setContactFrameIndex(0);
        setTimeout(() => {
          setViewMode('carousel');
          setShowContact(true);
          // Reset scroll to 0 so content starts at left edge (no extra padding)
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 0;
          }
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setIsTransitioning(false);
            });
          });
        }, 600);
      } else {
        // Capture the most central visible frame BEFORE toggling contact on
        const container = scrollContainerRef.current;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const containerCenter = containerRect.left + containerRect.width / 2;
          let closestIndex: number | null = null;
          let closestDistance = Infinity;

          frameRefs.current.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            // Check if frame is at least partially visible
            if (rect.right > containerRect.left && rect.left < containerRect.right) {
              // Calculate distance from frame center to container center
              const frameCenter = rect.left + rect.width / 2;
              const distance = Math.abs(frameCenter - containerCenter);
              if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
              }
            }
          });

          setContactFrameIndex(closestIndex);

          // Animate scroll to center the frame
          if (closestIndex !== null) {
            const element = frameRefs.current.get(closestIndex);
            if (element) {
              const frameRect = element.getBoundingClientRect();
              const frameCenter = frameRect.left + frameRect.width / 2;
              const scrollOffset = frameCenter - containerCenter;
              container.scrollTo({
                left: container.scrollLeft + scrollOffset,
                behavior: 'smooth'
              });
            }
          }
        }
        setShowContact(true);
      }
    } else {
      // Closing contact - return to grid if we came from there
      if (returnToGrid) {
        setIsTransitioning(true);
        setShowContact(false);
        setTimeout(() => {
          setReturnToGrid(false);
          setViewMode('grid');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setIsTransitioning(false);
            });
          });
        }, 600);
      } else {
        setShowContact(false);
      }
    }
  };

  // Helper to get frame indices for writing display
  // Landscape frames hold 2 articles, portrait frames hold 1
  const getFrameIndicesForWriting = (): number[] => {
    const articleCount = WRITING_CONTENT.length;
    if (allMediaItems.length === 0) return Array.from({ length: articleCount }, (_, i) => i);

    const framesToUse: number[] = [];
    let articlesAssigned = 0;

    for (const item of allMediaItems) {
      if (articlesAssigned >= articleCount) break;
      framesToUse.push(item.globalIndex);
      // Landscape frames hold 2 articles, portrait frames hold 1
      articlesAssigned += item.isLandscape ? 2 : 1;
    }

    return framesToUse;
  };

  // Function to toggle writing mode - shows articles across multiple frames
  const handleWritingToggle = () => {
    if (!showWriting) {
      // Close info and contact if open (mutually exclusive)
      if (showInfo) {
        setShowInfo(false);
      }
      if (showContact) {
        setShowContact(false);
      }
      // If in grid mode, crossfade to carousel and mark to return
      if (viewMode === 'grid') {
        setReturnToGrid(true);
        setIsTransitioning(true);
        // Use first frames for writing display when coming from grid
        setWritingFrameIndices(getFrameIndicesForWriting());
        setTimeout(() => {
          setViewMode('carousel');
          setShowWriting(true);
          // Reset scroll to 0 so content starts at left edge
          if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = 0;
          }
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setIsTransitioning(false);
            });
          });
        }, 600);
      } else {
        // In carousel mode, select visible/central frames for writing
        const container = scrollContainerRef.current;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const containerCenter = containerRect.left + containerRect.width / 2;

          // Find all visible frames with their distance from center
          const visibleFrames: { index: number; distanceFromCenter: number }[] = [];

          frameRefs.current.forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            // Check if frame is at least partially visible
            if (rect.right > containerRect.left && rect.left < containerRect.right) {
              const frameCenter = rect.left + rect.width / 2;
              visibleFrames.push({
                index,
                distanceFromCenter: Math.abs(frameCenter - containerCenter)
              });
            }
          });

          // Sort by distance from center (most central first)
          visibleFrames.sort((a, b) => a.distanceFromCenter - b.distanceFromCenter);

          // Select frames to hold all articles
          // Landscape frames hold 2 articles, portrait frames hold 1
          const framesToUse: number[] = [];
          let articlesAssigned = 0;
          const articleCount = WRITING_CONTENT.length;

          for (const frame of visibleFrames) {
            if (articlesAssigned >= articleCount) break;
            framesToUse.push(frame.index);
            const mediaItem = allMediaItems.find(m => m.globalIndex === frame.index);
            articlesAssigned += mediaItem?.isLandscape ? 2 : 1;
          }

          // If we don't have enough visible frames, add adjacent frames
          if (articlesAssigned < articleCount) {
            const usedIndices = new Set(framesToUse);
            for (const item of allMediaItems) {
              if (articlesAssigned >= articleCount) break;
              if (!usedIndices.has(item.globalIndex)) {
                framesToUse.push(item.globalIndex);
                usedIndices.add(item.globalIndex);
                articlesAssigned += item.isLandscape ? 2 : 1;
              }
            }
          }

          // Sort by index for consistent display order
          framesToUse.sort((a, b) => a - b);
          setWritingFrameIndices(framesToUse);
        }
        setShowWriting(true);
      }
    } else {
      // Closing writing - return to grid if we came from there
      if (returnToGrid) {
        setIsTransitioning(true);
        setShowWriting(false);
        setTimeout(() => {
          setReturnToGrid(false);
          setViewMode('grid');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setIsTransitioning(false);
            });
          });
        }, 600);
      } else {
        setShowWriting(false);
      }
    }
  };

  // Lock scroll when expanded
  useEffect(() => {
    if (expandedMedia) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [expandedMedia]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!expandedMedia) return;

    const allFlatMedia = filteredProjects.flatMap(project =>
      project.media.map(item => ({ item, projectTitle: project.title }))
    );
    const currentIndex = expandedMedia.globalIndex;
    const totalItems = allFlatMedia.length;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedMedia(null);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        const prevIndex = currentIndex - 1;
        const prev = allFlatMedia[prevIndex];
        setExpandedMedia({ item: prev.item, projectTitle: prev.projectTitle, globalIndex: prevIndex });
      } else if (e.key === 'ArrowRight' && currentIndex < totalItems - 1) {
        const nextIndex = currentIndex + 1;
        const next = allFlatMedia[nextIndex];
        setExpandedMedia({ item: next.item, projectTitle: next.projectTitle, globalIndex: nextIndex });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [expandedMedia, filteredProjects]);

  // Mouse position scroll effect (for carousel and grid)
  useEffect(() => {
    // Don't scroll when intro is showing or contact is active
    if (showIntro) return;
    if (showContact) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollSpeed = 0;
    const baseSpeed = 6;
    const edgeSpeed = 15; // Faster speed at extreme edges
    const menuHeight = 150; // Height from bottom where menu is (bottom-[50px] + some padding)

    // Function to calculate max scroll for info or writing mode dynamically
    const getMaxScroll = (): number => {
      // For info mode
      if (showInfo && visibleFrameIndices.length > 0) {
        const lastInfoIndex = visibleFrameIndices[visibleFrameIndices.length - 1];
        const lastFrame = frameRefs.current.get(lastInfoIndex);
        if (!lastFrame) return Infinity;

        const containerRect = container.getBoundingClientRect();
        const frameRect = lastFrame.getBoundingClientRect();
        const currentScroll = container.scrollLeft;
        return currentScroll + (frameRect.right - containerRect.right) + 50;
      }

      // For writing mode - limit to article frames
      if (showWriting && writingFrameIndices.length > 0) {
        const lastWritingIndex = writingFrameIndices[writingFrameIndices.length - 1];
        const lastFrame = frameRefs.current.get(lastWritingIndex);
        if (!lastFrame) return Infinity;

        const containerRect = container.getBoundingClientRect();
        const frameRect = lastFrame.getBoundingClientRect();
        const currentScroll = container.scrollLeft;
        return currentScroll + (frameRect.right - containerRect.right) + 50;
      }

      return Infinity;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const centerZone = 0.3; // 30% in the center = no scroll
      const edgeZone = 0.1; // 10% at extreme edges = faster scroll

      // Don't scroll if mouse is near the bottom (over the menu)
      if (mouseY > windowHeight - menuHeight) {
        scrollSpeed = 0;
        return;
      }

      const relativeX = mouseX / windowWidth;

      if (relativeX < edgeZone) {
        // Extreme left edge - fast scroll left
        const intensity = 1 - (relativeX / edgeZone);
        scrollSpeed = -edgeSpeed * intensity - baseSpeed;
      } else if (relativeX < (0.5 - centerZone / 2)) {
        // Left side - normal scroll left
        const intensity = 1 - ((relativeX - edgeZone) / (0.5 - centerZone / 2 - edgeZone));
        scrollSpeed = -baseSpeed * intensity;
      } else if (relativeX > (1 - edgeZone)) {
        // Extreme right edge - fast scroll right
        const intensity = (relativeX - (1 - edgeZone)) / edgeZone;
        scrollSpeed = edgeSpeed * intensity + baseSpeed;
      } else if (relativeX > (0.5 + centerZone / 2)) {
        // Right side - normal scroll right
        const intensity = (relativeX - (0.5 + centerZone / 2)) / (0.5 - centerZone / 2 - edgeZone);
        scrollSpeed = baseSpeed * Math.min(intensity, 1);
      } else {
        // Center zone - no scroll
        scrollSpeed = 0;
      }
    };

    const handleMouseLeave = () => {
      // Stop scrolling when mouse leaves the page
      scrollSpeed = 0;
    };

    const animate = () => {
      if (scrollSpeed !== 0 && container) {
        const newScroll = container.scrollLeft + scrollSpeed;
        // In info or writing mode, limit scroll to not go past the last frame
        if (showInfo || showWriting) {
          const maxScroll = getMaxScroll();
          container.scrollLeft = Math.max(0, Math.min(newScroll, maxScroll));
        } else {
          container.scrollLeft = newScroll;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [showIntro, showContact, showWriting, showInfo, viewMode, visibleFrameIndices, writingFrameIndices]);

  // Show mobile site on small screens, loading state while detecting
  if (!isLoaded) {
    return <div className="w-full h-screen bg-white dark:bg-[#1a1a1a]" />;
  }

  if (isMobile) {
    return <MobileSite />;
  }

  return (
    <>
      {/* Intro Splash */}
      {showIntro && <IntroSplash onComplete={() => setShowIntro(false)} />}

      {/* Main Gallery */}
      <div className={`w-full h-[calc(100vh-100px)] overflow-hidden transition-opacity-smooth ${showIntro ? 'opacity-0' : 'opacity-100'}`}>
        {/* Carousel View */}
        {viewMode === 'carousel' && (
          <div ref={scrollContainerRef} className={`h-full overflow-x-auto overflow-y-hidden transition-opacity-smooth ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} style={{ scrollbarWidth: 'none' }}>
            <div key={activeCategory} className="flex h-full items-center" style={{ width: 'max-content', paddingLeft: ((showInfo || showContact || showWriting) && returnToGrid) ? 'var(--info-padding)' : '150px', paddingRight: '150px' }}>
              {filteredProjects.map((project, projectIndex) => {
              // Calculate project start index for global frame numbering
              const projectStartIndex = orderedProjects.slice(0, orderedProjects.findIndex(p => p.id === project.id))
                .reduce((acc, p) => acc + p.media.length, 0);

              // All projects use the same gap for spacing between projects
              // First project has no extra left margin since carousel padding provides the edge spacing
              const isFirstProject = projectIndex === 0;

              return (
                <div key={`${activeCategory}-${project.id}`} className="flex items-center h-full">
                  {/* Project title - vertical (invisible but keeps space in info/contact/writing mode to prevent jump) */}
                  <div
                    className={`flex-shrink-0 flex items-end pb-4 transition-opacity-smooth ${showInfo || showContact || showWriting ? 'opacity-0' : 'opacity-100'}`}
                    style={{ height: 'var(--carousel-height)', marginLeft: isFirstProject ? '0' : 'var(--carousel-project-gap)', marginRight: 'var(--carousel-title-gap)' }}
                  >
                    <span
                      className="text-4xl tracking-wide text-black/60 dark:text-white/60"
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        fontFamily: '"Cormorant Garamond", Georgia, serif',
                        fontWeight: 700,
                      }}
                    >
                      {project.title}
                    </span>
                  </div>
                  {/* Project group */}
                  <div className="flex items-center h-full" style={{ gap: 'var(--carousel-gap)' }}>
                    {project.media.map((item, mediaIndex) => {
                      // Calculate global media index
                      const globalIndex = projectStartIndex + mediaIndex;

                      // Use isLandscape directly from the item
                      const isLandscape = item.isLandscape || false;

                      // Find if this frame should show info content
                      const visiblePosition = visibleFrameIndices.indexOf(globalIndex);

                      // For portrait frames: 1 info section per frame
                      // For landscape frames: 2 info sections side-by-side
                      let infoItem: InfoItem | null = null;
                      let infoItem2: InfoItem | null = null;

                      if (visiblePosition !== -1) {
                        // Calculate which info section index this frame should start at
                        // by counting sections used by previous frames
                        let sectionIndex = 0;
                        for (let i = 0; i < visiblePosition; i++) {
                          const prevFrameIndex = visibleFrameIndices[i];
                          const prevMediaItem = allMediaItems.find(m => m.globalIndex === prevFrameIndex);
                          sectionIndex += prevMediaItem?.isLandscape ? 2 : 1;
                        }

                        // Only show content if we haven't exceeded our sections
                        if (sectionIndex < INFO_CONTENT.length) {
                          if (isLandscape) {
                            // Landscape: show 2 sections side-by-side (second may be null if we run out)
                            infoItem = INFO_CONTENT[sectionIndex];
                            infoItem2 = INFO_CONTENT[sectionIndex + 1] || null;
                          } else {
                            // Portrait: show exactly 1 section, never 2
                            infoItem = INFO_CONTENT[sectionIndex];
                            infoItem2 = null; // Explicitly null for portrait
                          }
                        }
                      }

                      // In info mode from grid, only show frames in visibleFrameIndices
                      // In info mode from carousel, show ALL frames (overlays only on selected ones)
                      // In contact mode, show all frames
                      const shouldShowFrame = !showInfo || !returnToGrid || visibleFrameIndices.includes(globalIndex);

                      if (!shouldShowFrame) return null;

                      // Determine aspect ratio: landscape = 16:9, portrait = 4:5
                      const isLandscapeFrame = item.isLandscape === true;

                      return (
                        <div
                          key={`${project.id}-${mediaIndex}`}
                          ref={(el) => {
                            if (el) frameRefs.current.set(globalIndex, el);
                            else frameRefs.current.delete(globalIndex);
                          }}
                          className={`relative flex-shrink-0 cursor-pointer ${isLandscapeFrame ? 'aspect-video' : 'aspect-[4/5]'}`}
                          style={{
                            height: 'var(--carousel-height)',
                          }}
                          onClick={() => {
                            // If info is showing, close it and return to gallery (or grid if we came from there)
                            if (showInfo) {
                              if (returnToGrid) {
                                setIsTransitioning(true);
                                setShowInfo(false);
                                setTimeout(() => {
                                  setReturnToGrid(false);
                                  setViewMode('grid');
                                  requestAnimationFrame(() => {
                                    requestAnimationFrame(() => {
                                      setIsTransitioning(false);
                                    });
                                  });
                                }, 600);
                              } else {
                                setShowInfo(false);
                              }
                              return;
                            }
                            // If contact is showing and clicking a different frame, unlock contact mode
                            if (showContact && globalIndex !== contactFrameIndex) {
                              if (returnToGrid) {
                                setIsTransitioning(true);
                                setShowContact(false);
                                setTimeout(() => {
                                  setReturnToGrid(false);
                                  setViewMode('grid');
                                  requestAnimationFrame(() => {
                                    requestAnimationFrame(() => {
                                      setIsTransitioning(false);
                                    });
                                  });
                                }, 600);
                              } else {
                                setShowContact(false);
                              }
                              return;
                            }
                            // Normal click behavior - expand media (but not in contact mode)
                            if (!showContact) {
                              setExpandedMedia({ item, projectTitle: project.title, globalIndex });
                            }
                          }}
                        >
                          {/* Media - use object-cover to fill frame completely */}
                          {item.type === 'video' ? (
                            // Use Vimeo iframe in production when vimeoId exists, local file in dev
                            item.vimeoId && process.env.NODE_ENV === 'production' ? (
                              <div
                                className={`w-full h-full overflow-hidden transition-opacity-smooth ${showInfo || (showContact && globalIndex === contactFrameIndex) || (showWriting && writingFrameIndices.includes(globalIndex)) ? 'opacity-30' : 'opacity-100'}`}
                              >
                                <iframe
                                  src={`https://player.vimeo.com/video/${item.vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
                                  className="border-0"
                                  allow="autoplay; fullscreen"
                                  style={{
                                    pointerEvents: 'none',
                                    // For portrait 9:16 video in 4:5 frame: scale width to 177.78% (16/9) and center with negative margin
                                    // For landscape 16:9 video in 16:9 frame: no scaling needed
                                    width: isLandscapeFrame ? '100%' : '177.78%',
                                    height: '100%',
                                    marginLeft: isLandscapeFrame ? '0' : '-38.89%',
                                  }}
                                />
                              </div>
                            ) : (
                              <video
                                src={item.src}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className={`w-full h-full object-cover transition-opacity-smooth ${showInfo || (showContact && globalIndex === contactFrameIndex) || (showWriting && writingFrameIndices.includes(globalIndex)) ? 'opacity-30' : 'opacity-100'}`}
                              />
                            )
                          ) : (
                            <img
                              src={item.src}
                              alt=""
                              className={`w-full h-full object-cover transition-opacity-smooth ${showInfo || (showContact && globalIndex === contactFrameIndex) || (showWriting && writingFrameIndices.includes(globalIndex)) ? 'opacity-30' : 'opacity-100'}`}
                            />
                          )}

                          {/* Info overlay on this frame */}
                          {showInfo && infoItem && (
                            <InfoOverlay
                              isLandscape={isLandscape}
                              infoItem={infoItem}
                              infoItem2={infoItem2}
                              onClose={() => {
                                if (returnToGrid) {
                                  setIsTransitioning(true);
                                  setShowInfo(false);
                                  setTimeout(() => {
                                    setReturnToGrid(false);
                                    setViewMode('grid');
                                    requestAnimationFrame(() => {
                                      requestAnimationFrame(() => {
                                        setIsTransitioning(false);
                                      });
                                    });
                                  }, 600);
                                } else {
                                  setShowInfo(false);
                                }
                              }}
                            />
                          )}

                          {/* Contact overlay on this frame */}
                          {showContact && globalIndex === contactFrameIndex && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-white/50 dark:bg-[#1a1a1a]/50">
                              <a
                                href={`mailto:${CONTACT_CONTENT.email}`}
                                className="text-2xl md:text-3xl hover:opacity-50 transition-opacity duration-300 text-black dark:text-white mb-4"
                                style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                              >
                                {CONTACT_CONTENT.email}
                              </a>
                              <a
                                href="https://instagram.com/hofman.studio"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-2xl md:text-3xl hover:opacity-50 transition-opacity duration-300 text-black dark:text-white"
                                style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                              >
                                {CONTACT_CONTENT.instagram}
                              </a>
                            </div>
                          )}

                          {/* Writing overlay on this frame - show article based on position in writingFrameIndices */}
                          {showWriting && writingFrameIndices.includes(globalIndex) && (() => {
                            const writingPosition = writingFrameIndices.indexOf(globalIndex);

                            // Calculate which article index this frame should start at
                            // by counting articles used by previous frames
                            let articleStartIndex = 0;
                            for (let i = 0; i < writingPosition; i++) {
                              const prevFrameIndex = writingFrameIndices[i];
                              const prevMediaItem = allMediaItems.find(m => m.globalIndex === prevFrameIndex);
                              articleStartIndex += prevMediaItem?.isLandscape ? 2 : 1;
                            }

                            // Only show content if we haven't exceeded our articles
                            if (articleStartIndex >= WRITING_CONTENT.length) return null;

                            const article = WRITING_CONTENT[articleStartIndex];
                            // For landscape: show 2 articles side-by-side (second may be null if we run out)
                            const article2 = isLandscape ? (WRITING_CONTENT[articleStartIndex + 1] || null) : null;

                            if (!article) return null;
                            return (
                              <ArticleOverlay
                                isLandscape={isLandscape}
                                article={article}
                                article2={article2}
                                onClose={() => {
                                  if (returnToGrid) {
                                    setIsTransitioning(true);
                                    setShowWriting(false);
                                    setTimeout(() => {
                                      setReturnToGrid(false);
                                      setViewMode('grid');
                                      requestAnimationFrame(() => {
                                        requestAnimationFrame(() => {
                                          setIsTransitioning(false);
                                        });
                                      });
                                    }, 600);
                                  } else {
                                    setShowWriting(false);
                                  }
                                }}
                              />
                            );
                          })()}
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
            </div>
          </div>
        )}

        {/* Grid View - horizontal scroll with 2 rows, landscape takes 2x width */}
        {viewMode === 'grid' && (
          <div ref={scrollContainerRef} className={`h-full overflow-x-auto overflow-y-hidden flex items-center transition-opacity-smooth ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} style={{ scrollbarWidth: 'none', paddingLeft: 'var(--grid-padding)', paddingRight: 'var(--grid-padding)' }}>
            <div className="flex flex-col flex-wrap content-start" style={{ width: 'max-content', height: 'var(--carousel-height)', gap: 'var(--grid-gap)' }}>
              {filteredProjects.map((project) => {
                // Calculate project start index for global frame numbering
                const projectStartIndex = orderedProjects.slice(0, orderedProjects.findIndex(p => p.id === project.id))
                  .reduce((acc, p) => acc + p.media.length, 0);

                return project.media.map((item, mediaIndex) => {
                  const globalIndex = projectStartIndex + mediaIndex;

                  // Determine aspect ratio: landscape = 16:9, portrait = 4:5
                  const isLandscapeGridFrame = item.isLandscape === true;

                  return (
                    <div
                      key={`${project.id}-${mediaIndex}`}
                      className={`relative cursor-pointer group overflow-hidden flex-shrink-0 ${isLandscapeGridFrame ? 'aspect-video' : 'aspect-[4/5]'}`}
                      style={{
                        height: 'var(--grid-row-height)',
                      }}
                      onClick={() => setExpandedMedia({ item, projectTitle: project.title, globalIndex })}
                    >
                      {item.type === 'video' ? (
                        item.vimeoId && process.env.NODE_ENV === 'production' ? (
                          <div className="w-full h-full overflow-hidden transition-transform-smooth group-hover:scale-105">
                            <iframe
                              src={`https://player.vimeo.com/video/${item.vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
                              className="border-0"
                              allow="autoplay; fullscreen"
                              style={{
                                pointerEvents: 'none',
                                width: item.isLandscape ? '100%' : '177.78%',
                                height: item.isLandscape ? '100%' : '100%',
                                marginLeft: item.isLandscape ? '0' : '-38.89%',
                              }}
                            />
                          </div>
                        ) : (
                          <video
                            src={item.src}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover transition-transform-smooth group-hover:scale-105"
                          />
                        )
                      ) : (
                        <img
                          src={item.src}
                          alt=""
                          className="w-full h-full object-cover transition-transform-smooth group-hover:scale-105"
                        />
                      )}
                      {/* Project title on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity-smooth">
                        <span className="text-white text-sm" style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}>{project.title}</span>
                      </div>
                    </div>
                  );
                });
              })}
            </div>
          </div>
        )}

        {/* Expanded overlay / Lightbox */}
        {expandedMedia && (() => {
          // Get flattened list of all media with project info for navigation
          const allFlatMedia = filteredProjects.flatMap(project =>
            project.media.map(item => ({ item, projectTitle: project.title }))
          );
          const currentIndex = expandedMedia.globalIndex;
          const totalItems = allFlatMedia.length;

          const goToPrev = () => {
            if (currentIndex > 0) {
              const prevIndex = currentIndex - 1;
              const prev = allFlatMedia[prevIndex];
              setExpandedMedia({ item: prev.item, projectTitle: prev.projectTitle, globalIndex: prevIndex });
            }
          };

          const goToNext = () => {
            if (currentIndex < totalItems - 1) {
              const nextIndex = currentIndex + 1;
              const next = allFlatMedia[nextIndex];
              setExpandedMedia({ item: next.item, projectTitle: next.projectTitle, globalIndex: nextIndex });
            }
          };

          const { item } = expandedMedia;

          return (
            <div
              className="fixed inset-0 z-50 bg-white dark:bg-[#1a1a1a] flex items-center justify-center"
              onClick={() => setExpandedMedia(null)}
            >
              {/* Left click zone for previous */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1/3 cursor-w-resize z-10"
                onClick={(e) => { e.stopPropagation(); goToPrev(); }}
              />

              {/* Right click zone for next */}
              <div
                className="absolute right-0 top-0 bottom-0 w-1/3 cursor-e-resize z-10"
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
              />

              {/* Media container */}
              <div className="relative max-w-[95vw] max-h-[80vh]" onClick={e => e.stopPropagation()}>
                {item.type === 'video' ? (
                  item.vimeoId && process.env.NODE_ENV === 'production' ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${item.vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
                      className="max-h-[80vh] border-0"
                      style={{
                        aspectRatio: item.isLandscape ? '16/9' : '9/16',
                        width: item.isLandscape ? '90vw' : 'auto',
                        height: item.isLandscape ? 'auto' : '80vh',
                      }}
                      allow="autoplay; fullscreen"
                    />
                  ) : (
                    item.isLandscape ? (
                      <video
                        src={item.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="max-h-[80vh] max-w-[95vw] object-contain"
                      />
                    ) : (
                      <div
                        className="relative h-[80vh] overflow-hidden"
                        style={{ width: 'calc(80vh * 9 / 16)' }}
                      >
                        <video
                          src={item.src}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
                        />
                      </div>
                    )
                  )
                ) : (
                  <img
                    src={item.src}
                    alt=""
                    className="max-w-full max-h-[80vh] object-contain"
                  />
                )}
              </div>

              {/* Info bar at bottom - centered */}
              <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none">
                <span
                  className="text-2xl text-black dark:text-white"
                  style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
                >
                  {expandedMedia.projectTitle}
                </span>
                <div className="flex items-center gap-4">
                  {item.process && (
                    <span
                      className="text-sm text-black/50 dark:text-white/50 uppercase tracking-widest"
                      style={{ fontFamily: 'Calibre, Arial, sans-serif' }}
                    >
                      {item.process}
                    </span>
                  )}
                  <span
                    className="text-sm text-black/30 dark:text-white/30"
                    style={{ fontFamily: 'Calibre, Arial, sans-serif' }}
                  >
                    {currentIndex + 1} / {totalItems}
                  </span>
                </div>
              </div>

              {/* Close button */}
              <button
                className="absolute top-5 right-5 text-black dark:text-white text-2xl hover:opacity-50 transition-opacity duration-300 z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedMedia(null);
                }}
              >
                ×
              </button>

              {/* Navigation arrows (visible on hover) */}
              {currentIndex > 0 && (
                <button
                  className="absolute left-8 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white text-4xl transition-opacity duration-300 z-20"
                  onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                >
                  ←
                </button>
              )}
              {currentIndex < totalItems - 1 && (
                <button
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-black/30 dark:text-white/30 hover:text-black dark:hover:text-white text-4xl transition-opacity duration-300 z-20"
                  onClick={(e) => { e.stopPropagation(); goToNext(); }}
                >
                  →
                </button>
              )}
            </div>
          );
        })()}
      </div>

      {/* Navigation Footer */}
      <NavFooter
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        showInfoOverlay={showInfo}
        onInfoToggle={handleInfoToggle}
        showContactOverlay={showContact}
        onContactToggle={handleContactToggle}
        showWritingOverlay={showWriting}
        onWritingToggle={handleWritingToggle}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />
    </>
  );
}
