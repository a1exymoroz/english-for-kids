import { actionSetA } from './sections/Action (set A)';
import { actionSetB } from './sections/Action (set B)';
import { animalSetA } from './sections/Animal (set A)';
import { animalSetB } from './sections/Animal (set B)';
import { clothes } from './sections/Clothes';
import { emotions } from './sections/Emotions';

export const cards = [
  {
    section: 'Action (set A)',
    items: actionSetA,
  },
  {
    section: 'Action (set B)',
    items: actionSetB,
  },
  {
    section: 'Animal (set A)',
    items: animalSetA,
  },
  {
    section: 'Animal (set B)',
    items: animalSetB,
  },
  {
    section: 'Clothes',
    items: clothes,
  },
  {
    section: 'Emotions',
    items: emotions,
  },
];
