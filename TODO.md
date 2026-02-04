## Cześć!

Poniżej znajduje się niewielkie zadanie. Bardzo prosimy o jego wykonanie i umieszczenie
Twojego rozwiązania jako repozytorium Git dostępnego na GitHub/BitBucket/GitLab etc.

## Zadanie

Wykonaj aplikację w Next.js zawierającą formularz rejestracji nowego trenera Pokemon (imię i
wiek trenera, oraz jeden początkowy Pokemon). wg. projektu dostępnego TUTAJ.

## Wymagania

- Prosimy obowiązkowo o użycie w implementacji Next.js oraz TypeScript;
- Możesz użyć nowego app router, ale “stare” podejście (pages router) też będzie ok;
- Dobierz narzędzie, które najbardziej ci odpowiada;
- Sugerujemy również użycie MUI oraz Styled Components (np. Emotion), ale nie jest to obowiązkowe. Po prostu stosujemy je przy aktualnych projektach;
- Cała reszta bibliotek/narzędzi/pomocy dowolna - wybierz to, co najbardziej ułatwi ci pracę;
- Aplikacja powinna działać przynajmniej na przeglądarkach Firefox i Chrome;
- W dostarczonych zasobach znajduje się font IBM VGA. Załaduj go i użyj we wszystkich elementach aplikacji;
- Po stronie serwera Next.js pobierz informacje z API nt. dzisiejszej daty (patrz: linki na dole strony) i wyświetl ją w prawym górnym rogu strony;
- Pole `Name of trainer` (imię trenera) powinno nie być puste i zawierać 2-20 znaków;
- Pole `Age` (wiek trenera) powinno akceptować liczby w przedziale 16-99;
- Pole `Pokemon name` powinno być polem typu autocomplete i zachowywać się w następujący sposób:
    - W momencie kiedy użytkownik zaczyna wpisywać nazwę, autocomplete wysyła zapytanie do endpointa /api/search?name=<wartość inputa>, który zwraca propozycje początkowych Pokemonów dla trenera;
    - Endpoint musi zostać zaimplementowany przez Ciebie jako API Route. Jako bazę wykorzystaj dostarczony plik `.json`;
    - Proponowane pokemony powinny być wybierane techniką fuzzy search -
      możesz wykorzystać do tego bibliotekę Fuse.js.
    - Pamiętaj o debounce i cache - funkcjonalność ma działać tak, jakby miała
      iść na środowisko produkcyjne;
    - W momencie wyboru Pokemona z listy, jego imię zostaje wybrane jako
      wartość inputa, a jego podgląd wyświetla się w okienku niżej;
    - Dane o wybranym Pokemonie możesz pobrać z PokeAPI (patrz linki na dole strony);
- Przycisk Submit powinien zachowywać się w następujący sposób:
    - W przypadku nieprawidłowych wartości w formularzu nie rób nic i pokaż
      informacje o błędach pod polami formularza;
        - W przypadku prawidłowych pól wyświetl okienko z napisem Sukces! i przyciskiem resetu formularza;
- Przycisk Reset powinien resetować cały formularz;
- Całość pokryj odpowiednimi testami;
- Nie zapomnij dostarczyć nam README, w którym opisane będzie jak uruchomić Twój kod.

## Mile widziane

- Przygotuj uruchamianie wersji developerskiej (z odświeżaniem przy zmianach w pliku) oraz produkcyjnej aplikacji za pomocą Dockera.

    Zależy nam na poznaniu, w jaki sposób pracujesz na co dzień.
    Nie chwal się wszystkim, co potrafisz, ale wybierz odpowiednie narzędzia do danej sytuacji.
    Zaimplementuj zadanie tak, jakbyś pracował przy realnym projektem, mającym działać na
    produkcji. Pracuj bez żadnych ograniczeń - wszystko jest dozwolone (użycie wszelkich
    wspomagaczy jak np. Chat GPT także).

    Jeżeli nie będziesz wiedział, jak coś zrobić, lub czujesz, że jakaś część zajmuje Tobie za dużo
    czasu, to, tak czy inaczej, wyślij nam to, co masz. Nie zrobienie zadania w 100% nie
    dyskwalifikuje cię z procesu rekrutacyjnego.

    Na odesłanie zadania masz tydzień od dzisiaj, a my wrócimy do Ciebie z feedbackiem do
    maksymalnie w ciągu 3 dni roboczych.
    Powodzenia!

## Linki do potrzebnych API

- [Pokemon API](https://pokeapi.co/docs/v2#pokemon)
- [Time API](https://www.timeapi.io/api/Time/current/zone?timeZone=Europe/Warsaw)
`