'use client';

import { useState, useEffect } from 'react';

type Category = 'all' | 'motion' | 'stills';
type MobileView = 'gallery' | 'practice' | 'writing' | 'contact';

type MediaItem = {
  src: string;
  type: 'image' | 'video';
  isLandscape?: boolean;
  vimeoId?: string;
};

type Project = {
  id: string;
  title: string;
  media: MediaItem[];
};

type ArticleItem = {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  content: string[];
};

// Work projects - same data as desktop
const WORK_PROJECTS: Project[] = [
  {
    id: 'horlogerie',
    title: 'Horlogerie',
    media: [
      { src: "/images/Watch report/freepik__enhance__46843.jpg", type: "image", isLandscape: false },
      { src: "/images/Watch report/freepik__enhance__73551.jpg", type: "image", isLandscape: false },
      { src: "/images/Watch report/freepik__enhance__83979.jpg", type: "image", isLandscape: false },
      { src: "/images/Watch report/freepik__enhance__83980.jpg", type: "image", isLandscape: false },
    ],
  },
  {
    id: 'wild-rose',
    title: 'Wild Rose',
    media: [
      { src: "/videos/Wild rose/2026-01-07T20-41-29_top_down_shot__.mp4", type: "video", isLandscape: true, vimeoId: "1154688609" },
      { src: "/videos/Wild rose/kling_25_turbo_oil_drip_orbit_213420.mp4", type: "video", isLandscape: true, vimeoId: "1154688545" },
      { src: "/videos/Wild rose/kling_25_turbo_oil_drip_orbit_094147.mp4", type: "video", isLandscape: true, vimeoId: "1154688574" },
      { src: "/videos/Wild rose/2026-01-07T21-52-22_luma_prompt__.mp4", type: "video", isLandscape: true, vimeoId: "1154688635" },
    ],
  },
  {
    id: 'merit',
    title: 'Merit Beauty',
    media: [
      { src: "/images/Merit/SH_Merti_s1.jpg", type: "image", isLandscape: false },
      { src: "/images/Merit/SH_Merti_S2.jpg", type: "image", isLandscape: false },
    ],
  },
  {
    id: 'gucci',
    title: 'Gucci Beauty',
    media: [
      { src: "/images/Gucci Chrome absurdist/SH_Chrome_Absurdist_GucciSH_Nano_Packaging_00132_-standard v2-4x.jpg", type: "image", isLandscape: false },
      { src: "/images/Gucci Chrome absurdist/SH_Gucci_Master s2.jpg", type: "image", isLandscape: false },
    ],
  },
  {
    id: 'abstracts',
    title: 'Abstracts',
    media: [
      { src: "/videos/Asbstracts/SH_Sisley_Animation.mp4", type: "video", isLandscape: true, vimeoId: "1154689508" },
      { src: "/videos/Asbstracts/SH_SAB_Motion_02.mp4", type: "video", isLandscape: true, vimeoId: "1154689448" },
      { src: "/videos/Asbstracts/a_precise_tabletop_macro_composition_of_a_brushed_steel_audemars_piguet_chronograph_resting_on_a_se_5rjxgwuz6vjkyw0wq84x_1.mp4", type: "video", isLandscape: true, vimeoId: "1154688746" },
      { src: "/videos/Asbstracts/Professional_Mode_Camera_is_locked__A_transparent__4_chf3_prob4.mov", type: "video", isLandscape: true, vimeoId: "1154688698" },
    ],
  },
];

// Practice content - 4 sections
const PRACTICE_SECTIONS = [
  {
    title: 'We start with an idea. Not a tool.',
    content: `Every project begins with a concept, a product truth, and a visual direction. The method comes second.

Our background is still life and tabletop production. 15 years working with light, materials, motion, and control. That craft doesn't disappear in AI. It becomes the framework that guides it.

This isn't learned from tutorials. It's 15 years on set.`
  },
  {
    title: 'Concept, Then Movement',
    content: `Stills and motion aren't separate offerings. They're format choices.

A moment unfolding. A product revealed. An atmosphere built over time.

Sometimes that's a single frame. Sometimes it's motion. Often it's both. The language stays the same. Only the format changes.`
  },
  {
    title: 'Directed, Not Automated',
    content: `Nothing here is one-click. Nothing is left unattended.

Images and motion are shaped through reference, iteration, and adjustment. The same way a shoot evolves.

AI responds to direction. It doesn't replace it.`
  },
  {
    title: 'Craft at Speed',
    content: `AI is fast. That's not the hard part.

The hard part is fast work that doesn't look fast. Production that could have been shot but wasn't.

But speed isn't the point. It's the space to think properly. Concepts sketched, tested, rebuilt. Environments that never made sense to build. Combinations that wouldn't exist on a real set.

Not just generation. Direction. Not just speed. Craft and range.`
  }
];

// Writing/Articles content - same as desktop
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

// Images for splash flicker effect
const SPLASH_IMAGES = [
  "/images/Watch report/freepik__enhance__46843.jpg",
  "/images/Merit/SH_Merti_s1.jpg",
  "/images/Gucci Chrome absurdist/SH_Chrome_Absurdist_GucciSH_Nano_Packaging_00132_-standard v2-4x.jpg",
  "/images/Watch report/freepik__enhance__73551.jpg",
  "/images/Merit/SH_Merti_S2.jpg",
];

export const MobileSite = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [splashFading, setSplashFading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [activeView, setActiveView] = useState<MobileView>('gallery');
  const [expandedMedia, setExpandedMedia] = useState<MediaItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Flicker through images then fade out
  useEffect(() => {
    const flickerInterval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % SPLASH_IMAGES.length);
    }, 150);

    const stopFlickerTimer = setTimeout(() => {
      clearInterval(flickerInterval);
      setSplashFading(true);
    }, 2000);

    const hideTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => {
      clearInterval(flickerInterval);
      clearTimeout(stopFlickerTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Filter projects based on category
  const filteredProjects = activeCategory === 'all'
    ? WORK_PROJECTS
    : WORK_PROJECTS.map(project => ({
        ...project,
        media: project.media.filter(item =>
          activeCategory === 'motion' ? item.type === 'video' : item.type === 'image'
        )
      })).filter(project => project.media.length > 0);

  // Flatten all media for grid display
  const allMedia = filteredProjects.flatMap(project =>
    project.media.map(item => ({ ...item, projectTitle: project.title }))
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#1a1a1a] flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Splash Screen with flickering images */}
      {showSplash && (
        <div
          className={`fixed inset-0 z-[200] bg-white dark:bg-[#1a1a1a] flex items-center justify-center transition-opacity duration-500 ${splashFading ? 'opacity-0' : 'opacity-100'}`}
        >
          <img
            src={SPLASH_IMAGES[currentImageIndex]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <h1 className="relative z-10 text-2xl tracking-wide">
            <span className="font-calibre">Hofman</span>
            <span className="font-calibre">/</span>
            <span style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}>Studio</span>
          </h1>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a] px-5 py-4 flex justify-between items-center border-b border-black/10 dark:border-white/10">
        <button
          onClick={() => { setActiveView('gallery'); setSelectedArticle(null); setMenuOpen(false); }}
          className="text-lg tracking-wide"
        >
          <span className="font-calibre">Hofman</span>
          <span className="font-calibre">/</span>
          <span style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}>Studio</span>
        </button>
        {/* Hamburger menu icon */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="w-8 h-8 flex flex-col justify-center items-center gap-1.5"
          aria-label="Menu"
        >
          <span className={`block w-5 h-0.5 bg-black dark:bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-black dark:bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-black dark:bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </header>

      {/* Menu Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-white dark:bg-[#1a1a1a] pt-20 px-6 transition-opacity duration-300"
          style={{ opacity: menuOpen ? 1 : 0 }}
        >
          <nav className="flex flex-col gap-8 pt-10">
            <button
              onClick={() => { setActiveView('gallery'); setSelectedArticle(null); setMenuOpen(false); }}
              className={`text-2xl font-calibre text-left transition-opacity ${activeView === 'gallery' ? 'opacity-100' : 'opacity-50'}`}
            >
              Work
            </button>
            <button
              onClick={() => { setActiveView('practice'); setSelectedArticle(null); setMenuOpen(false); }}
              className={`text-2xl font-calibre text-left transition-opacity ${activeView === 'practice' ? 'opacity-100' : 'opacity-50'}`}
            >
              Practice
            </button>
            <button
              onClick={() => { setActiveView('writing'); setSelectedArticle(null); setMenuOpen(false); }}
              className={`text-2xl font-calibre text-left transition-opacity ${activeView === 'writing' ? 'opacity-100' : 'opacity-50'}`}
            >
              Writing
            </button>
            <button
              onClick={() => { setActiveView('contact'); setSelectedArticle(null); setMenuOpen(false); }}
              className={`text-2xl font-calibre text-left transition-opacity ${activeView === 'contact' ? 'opacity-100' : 'opacity-50'}`}
            >
              Contact
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 pt-20 pb-10 overflow-y-auto">
        {/* Gallery View */}
        {activeView === 'gallery' && (
          <div className="p-3">
            <div className="grid grid-cols-2 gap-2">
              {allMedia.map((item, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer overflow-hidden ${item.isLandscape ? 'col-span-2' : ''}`}
                  style={{ aspectRatio: item.isLandscape ? '16/9' : '3/4' }}
                  onClick={() => setExpandedMedia(item)}
                >
                  {item.type === 'video' ? (
                    item.vimeoId && process.env.NODE_ENV === 'production' ? (
                      <iframe
                        src={`https://player.vimeo.com/video/${item.vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
                        className="w-full h-full border-0"
                        allow="autoplay; fullscreen"
                        style={{ pointerEvents: 'none' }}
                      />
                    ) : (
                      <video
                        src={item.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <img
                      src={item.src}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Practice View - Better layout */}
        {activeView === 'practice' && (
          <div className="px-6 py-8">
            {PRACTICE_SECTIONS.map((section, index) => (
              <section key={index} className="mb-16 last:mb-0">
                <h2
                  className="text-lg font-bold uppercase tracking-tight mb-6 font-calibre"
                  style={{ lineHeight: 1.2 }}
                >
                  {section.title}
                </h2>
                <div
                  className="text-base leading-relaxed opacity-80"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {section.content.split('\n\n').map((para, i) => (
                    <p key={i} className={i > 0 ? 'mt-5' : ''}>
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Writing View - Article list or single article */}
        {activeView === 'writing' && !selectedArticle && (
          <div className="py-4 px-6">
            <div className="flex flex-col gap-5">
              {WRITING_CONTENT.map((article, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedArticle(article)}
                  className="block w-full text-left py-2"
                >
                  <h2
                    className="text-base font-bold uppercase tracking-tight mb-1 font-calibre"
                    style={{ lineHeight: 1.2 }}
                  >
                    {article.title}
                  </h2>
                  <p
                    className="text-xs opacity-50"
                    style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}
                  >
                    {article.subtitle}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Single Article View */}
        {activeView === 'writing' && selectedArticle && (
          <div className="px-6 py-10">
            <button
              onClick={() => setSelectedArticle(null)}
              className="text-base font-calibre mb-10 flex items-center gap-2 py-2"
            >
              ← Back
            </button>
            <h1
              className="text-xl font-bold uppercase tracking-tight mb-4 font-calibre"
              style={{ lineHeight: 1.2 }}
            >
              {selectedArticle.title}
            </h1>
            <p
              className="text-base opacity-70 mb-10"
              style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', lineHeight: 1.5 }}
            >
              {selectedArticle.subtitle}
            </p>
            <div style={{ fontFamily: 'Georgia, serif' }}>
              {selectedArticle.content.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base mb-6 last:mb-0"
                  style={{ lineHeight: 1.7 }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Contact View */}
        {activeView === 'contact' && (
          <div className="px-6 flex flex-col items-center justify-center min-h-[60vh]">
            <a
              href="mailto:hello@hofman.studio"
              className="text-xl mb-6 hover:opacity-50 transition-opacity"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              hello@hofman.studio
            </a>
            <a
              href="https://instagram.com/hofman.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl hover:opacity-50 transition-opacity"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              @Hofman/studio
            </a>
          </div>
        )}
      </main>

      {/* Bottom Navigation - Category Filters (only show in gallery view) */}
      {activeView === 'gallery' && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#1a1a1a] px-6 py-4 flex justify-center gap-8 border-t border-black/10 dark:border-white/10">
          {(['all', 'motion', 'stills'] as Category[]).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`text-base font-calibre transition-opacity ${activeCategory === category ? 'opacity-100' : 'opacity-50'}`}
            >
              {category === 'all' ? 'All' : category === 'motion' ? 'Motion' : 'Stills'}
            </button>
          ))}
        </nav>
      )}


      {/* Expanded Media Overlay */}
      {expandedMedia && (
        <div
          className="fixed inset-0 z-[100] bg-white dark:bg-[#1a1a1a] flex items-center justify-center"
          onClick={() => setExpandedMedia(null)}
        >
          {expandedMedia.type === 'video' ? (
            expandedMedia.vimeoId && process.env.NODE_ENV === 'production' ? (
              <iframe
                src={`https://player.vimeo.com/video/${expandedMedia.vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
                className="w-full max-h-full aspect-video border-0"
                allow="autoplay; fullscreen"
              />
            ) : (
              <video
                src={expandedMedia.src}
                autoPlay
                loop
                muted
                playsInline
                className="max-w-full max-h-full object-contain"
              />
            )
          ) : (
            <img
              src={expandedMedia.src}
              alt=""
              className="max-w-full max-h-full object-contain"
            />
          )}
          <button
            className="absolute top-4 right-4 text-3xl opacity-60 hover:opacity-100 transition-opacity p-2"
            onClick={(e) => {
              e.stopPropagation();
              setExpandedMedia(null);
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};
