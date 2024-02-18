import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

type PasswordStrength = 'empty' | 'short' | 'easy' | 'medium' | 'strong';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public title: string = 'usense-test-task';
  public eyeIcon: 'close' | 'open' = 'close';
  public typeOfInput: 'password' | 'text' = 'password';
  public passwordStrength: PasswordStrength = 'empty';

  private unsubscriber$ = new Subject<void>();

  constructor(private formBuilder: FormBuilder) {
    this.form = formBuilder.group({
      password: ['']
    });
  }

  ngOnInit(): void {
    this.form.get('password')?.valueChanges.pipe(takeUntil(this.unsubscriber$)).subscribe((password) => {
      this.calculatePasswordStrength(password);
    });
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  public clearPassword(): void {
    this.form.controls['password'].setValue('');
  }

  public showHidePassword(): void {
    this.typeOfInput = this.typeOfInput !== 'password' ? 'password' : 'text';
    this.eyeIcon = this.typeOfInput === 'password' ? 'close' : 'open';
  }

  private calculatePasswordStrength(password: string): void {
    if (password.length === 0) {
      this.passwordStrength = 'empty';
    }

    if (password.length > 0 && password.length < 8) {
      this.passwordStrength = 'short';
    }

    if (password.length >= 8) {
      this.passwordStrength = this.calculateSymbolsStrength(password);
    }
  }

  private calculateSymbolsStrength(password: string): PasswordStrength {
    const hasDigits: boolean = /\d/.test(password);
    const hasLetters: boolean = /(?=[A-zА-яЁёЪъЇїЄє])[^\\_\^\[\]]|^$/.test(password);
    const hasSymbols: boolean = /(?=[\W_])[^ЁёЪъЇїЄє]|^$/.test(password);

    if (hasDigits && hasLetters && hasSymbols) {
      return 'strong'
    }

    if ((hasDigits && hasLetters) || (hasDigits && hasSymbols) || (hasLetters && hasSymbols)) {
      return 'medium';
    }

    return 'easy';
  }
}
