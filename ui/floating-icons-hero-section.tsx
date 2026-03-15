'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { Button } from '@/ui/button';

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

interface IconProps {
  id: number;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  className: string;
}

export interface FloatingIconsHeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
  icons: IconProps[];
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Icon Component */
/* ------------------------------------------------------------------ */

const FloatingIcon = ({
  mouseX,
  mouseY,
  iconData,
  index,
  register,
}: {
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
  iconData: IconProps;
  index: number;
  register: (el: HTMLDivElement | null) => void;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 25 });
  const springY = useSpring(y, { stiffness: 200, damping: 25 });

  /* Cursor repulsion (VERY subtle) */
  React.useEffect(() => {
    const handleMouseMove = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const dx = mouseX.current - (rect.left + rect.width / 2);
      const dy = mouseY.current - (rect.top + rect.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 140) {
        const force = (1 - distance / 140) * 12;
        x.set(-dx / distance * force);
        y.set(-dy / distance * force);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y, mouseX, mouseY]);

  return (
    <motion.div
      ref={(el) => {
        ref.current = el;
        register(el);
      }}
      style={{ x: springX, y: springY }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.06,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn('absolute will-change-transform', iconData.className)}
    >
      <motion.div
        className="flex items-center justify-center
          w-12 h-12 md:w-14 md:h-14
          rounded-2xl
          bg-background/30 backdrop-blur-md
          border border-primary/10
          shadow-sm"
        animate={{
          y: [0, -3, 0],
          rotate: [0, 1.5, 0],
        }}
        transition={{
          duration: 6,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      >
        <iconData.icon className="w-7 h-7 text-foreground/80" />
      </motion.div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Main Component */
/* ------------------------------------------------------------------ */

export const FloatingIconsHero = React.forwardRef<
  HTMLElement,
  FloatingIconsHeroProps
>(({ title, subtitle, ctaText, ctaHref, icons, className }, ref) => {
  const containerRef = React.useRef<HTMLElement>(null);
  const iconsRef = React.useRef<HTMLDivElement[]>([]);
  const mouseX = React.useRef(0);
  const mouseY = React.useRef(0);

  const registerIcon = (el: HTMLDivElement | null) => {
    if (el && !iconsRef.current.includes(el)) {
      iconsRef.current.push(el);
    }
  };

  /* Mouse tracking */
  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.current = e.clientX;
    mouseY.current = e.clientY;
  };

  /* ------------------------------------------------------------------ */
  /* GSAP Noise Cancellation + Calm Motion */
  /* ------------------------------------------------------------------ */

  React.useEffect(() => {
    const iconsEls = iconsRef.current;
    if (!containerRef.current || iconsEls.length === 0) return;

    /* Idle settle */
    const idleTween = gsap.to(iconsEls, {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      duration: 3,
      ease: 'power3.out',
      stagger: { each: 0.06, from: 'random' },
    });

    /* Micro parallax */
    gsap.to(iconsEls, {
      y: (i) => (i % 2 === 0 ? -6 : 6),
      duration: 8,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });

    /* Scroll calm */
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const calm = 1 - Math.abs(self.progress - 0.5) * 2;
        gsap.to(iconsEls, {
          opacity: 0.25 + calm * 0.4,
          duration: 0.6,
          overwrite: 'auto',
        });
      },
    });

    /* OPTIONAL: pause animations when tab hidden */
    const onVisibility = () => {
      document.hidden
        ? gsap.globalTimeline.pause()
        : gsap.globalTimeline.resume();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      idleTween.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <section
      ref={(el) => {
        containerRef.current = el;
        if (typeof ref === 'function') ref(el);
      }}
      onMouseMove={handleMouseMove}
      className={cn(
        'relative w-full overflow-hidden',
        'flex items-center justify-center',
        className
      )}
    >
      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        {icons.map((icon, i) => (
          <FloatingIcon
            key={icon.id}
            iconData={icon}
            index={i}
            mouseX={mouseX}
            mouseY={mouseY}
            register={registerIcon}
          />
        ))}
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-3xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-3xl md:text-5xl font-bold tracking-tight"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-4 text-muted-foreground max-w-xl mx-auto"
        >
          {subtitle}
        </motion.p>

        {ctaText && ctaHref && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-10"
          >
            <Button asChild size="lg">
              <a href={ctaHref}>{ctaText}</a>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
});

FloatingIconsHero.displayName = 'FloatingIconsHero';
