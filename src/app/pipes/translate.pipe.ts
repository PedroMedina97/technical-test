import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { TranslationService, Language } from '../services/translation.service';
import { Subscription } from 'rxjs';

@Pipe({
  name: 'translate',
  pure: false // Make it impure to detect language changes
})
export class TranslatePipe implements PipeTransform, OnDestroy {
  private languageSubscription: Subscription = new Subscription();
  private currentLanguage: Language = 'es';
  private changeCounter = 0;

  constructor(
    private translationService: TranslationService,
    private cdr: ChangeDetectorRef
  ) {
    // Subscribe to language changes to trigger pipe updates
    this.languageSubscription = this.translationService.currentLanguage$.subscribe((language) => {
      this.currentLanguage = language;
      this.changeCounter++;
      // Force change detection
      this.cdr.markForCheck();
    });
  }

  transform(key: string, params?: { [key: string]: string | number }): string {
    // Use changeCounter to force recalculation
    const _ = this.changeCounter;
    return this.translationService.translate(key, params);
  }

  ngOnDestroy(): void {
    this.languageSubscription.unsubscribe();
  }
}