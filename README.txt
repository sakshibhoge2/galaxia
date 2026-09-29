GALAXIA 2026 — CINEMATIC EDITION
PCCOE · MESA

OPEN THE WEBSITE
Extract the ZIP and open techfest/index.html. To publish, upload everything
inside techfest together. No npm install, build step or API key is needed.
Fonts and artwork are bundled locally; the design does not depend on a CDN.
The previews folder contains real desktop and mobile browser screenshots.

DESIGN
- Restrained graphite, black and silver palette inspired by the supplied poster.
- Star Jedi display lettering for GALAXIA; Oxanium for readable interface text.
- New cinematic scene with two cloaked figures, layered camera parallax and
  procedural WebGL fog. Darth Vader is blended into the timeline in monochrome.
- Four new mission images in a single optimized texture atlas.
- Three visible event cards: one main card with smaller cards behind it.
  Use arrows, dots, keyboard left/right, or swipe on a phone.
- One Millennium Falcon follows varied curved flights over the starfield.
- A motion toggle, system reduced-motion support, and hidden-tab pausing.

The character scene and ship are rendered image assets with live browser
animation. They are not rigged 3D character models or prerecorded video.
The atmosphere itself is rendered in real time with WebGL.

CONTENT PRESERVATION
The four registration form destinations and existing event names, descriptions,
prizes and timeline dates were kept from the uploaded website. The poster was
used for art direction, not as a replacement source for event facts. In
particular, the poster and original site disagree on the puzzle event's name
and prize: the existing website values remain in this version.

CONTACT FORM
The uploaded website did not contain a contact-message delivery endpoint.
This version preserves the form and shows an honest 'not sent' message on
submission. Registration links work independently. Connect your chosen
message service before using the contact form for real enquiries.

FILES TO EDIT
index.html — content, registration links, dates and prize amounts
style.css — typography, colors, responsive layout and card transitions
script.js — carousel, menu, starfield, WebGL fog, parallax and motion controls
flight.js — spacecraft size, speed and flight paths
assets/ — local imagery and font files

VALIDATION
Tested in Chromium at 1440 x 1000 and 390 x 844:
- no JavaScript page errors or horizontal overflow;
- all four event cards selectable, four original registration links retained;
- mobile navigation and motion controls working;
- custom fonts loaded, WebGL atmosphere compiled;
- reduced-motion preference disables background motion.

ARTWORK AND FONT SOURCES
The poster supplied by the user is the visual reference.
Star Jedi: Boba Fonts / Davide Canavero (1998).
Downloaded from https://www.dafont.com/star-jedi.font (listed as 100% Free).
Oxanium: The Oxanium Project Authors / Severin Meyer.
Source: https://github.com/google/fonts/tree/main/ofl/oxanium
License: assets/fonts/OFL-Oxanium.txt
Original Darth Vader image retained from the supplied website archive.
Hero, mission atlas and Falcon assets generated with the built-in image tool.
See ART-DIRECTION.txt for the image-generation prompts.
