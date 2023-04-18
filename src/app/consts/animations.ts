import {trigger, transition, style, animate, query, stagger, state} from '@angular/animations';

export const fadeInFromTop = trigger('fadeInFromTop', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-15px)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

export const dividerFade = trigger('dividerFade', [
   // state('out', style({ width: 0, opacity: 0.5, backgroundColor: 'green' })),
   //  state('in', style({ width: '*', opacity: 1 })),

  transition(':enter', [
    style({ width: 0, }),
    animate('1s cubic-bezier(.19,1.04,.91,.98)', style({ opacity: 1, width: '*' }))
  ]),

  transition('* => fade', [
    animate('.5s cubic-bezier(.94,1.22,1,.97)', style({ opacity: 0, width: 0 })),
    animate('10s', style({opacity: 0})),
  ]),
  ]);


export const fadeOutOnLeave = trigger('fadeOutOnLeave', [
  transition('* => fade', [
    query('[FadeOut]', [
      stagger(150, [
        animate('.4s ease-out',
          style({ opacity: 0, transform: 'translateY(-15px) scale(1.1)' })),
        animate('10s', style({opacity: 0}))
      ])
    ], {optional: true}),
    query('.my-element', animate('.3s', style({ opacity: 0 })), { optional: true })
  ])
]);
