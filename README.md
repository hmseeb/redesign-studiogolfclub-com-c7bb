# redesign-studiogolfclub-com-c7bb

Studio Golf — static website built with vanilla HTML, CSS and JavaScript.
No build step, no dependencies: `index.html` is the entry point.

## Structure

```
index.html                     Home
membership/                    Membership plans by club
why-studio-golf/               Why Studio Golf
  coaching-and-lessons/        Golf lessons & coaching
  stretching-and-fitness/      Golf-focused fitness
  custom-club-fitting/         Custom club fitting
  explore-our-bays/            Practice bays
locations/                     All locations
  scottsdale/ san-diego/ south-bay/ south-bay-ca/
  el-paso/ clearwater/ newport-beach/
events/                        Private events
member-for-a-day/              Be a Member for a Day
meet-the-team/                 Team index + individual profiles
privacy-policy/                Privacy Policy
terms-and-conditions/          Terms and Conditions

assets/css/site.css            Design system and all page styles
assets/js/site.js              Mobile nav, form handling, scroll reveal
favicon.svg                    Favicon
images/source/                 Photography
```

## Notes

- All internal links are root-relative (`/locations/south-bay/`).
- Forms POST to LeadrVision and work without JavaScript; with JavaScript they
  submit via `fetch()` to the same endpoint and confirm inline.
- The FAQ accordions use native `<details>`/`<summary>`, so they work with
  JavaScript disabled.
- `/review` is provided by the hosting platform and is not built here.
