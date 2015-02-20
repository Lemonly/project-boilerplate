#Lemonly's Front-end Project Boilerplate
#####v1.0

###Getting Started:
1. Clone project
2. `npm install` from the project root
3. `grunt server` from the project root
4. Navigate to http://your.ip.address.here:8888 in any browser or on any device to test the project
5. Edit variable values in dev/scss/_variables.scss to make quick changes to the site styling
6. `grunt build` from the project root will put a production version of the project in /build

###Based on these projects:
* [HTML5 Boilerplate](https://html5boilerplate.com/)
* [Abessive Theme](https://github.com/joshbroton/abessive)
* [Sassquatch](https://github.com/joshbroton/sassquatch)
* Lemonly HTML/CSS/JS Style Guides

###Changes:
* reset-normalize.scss replaced with normalize.csss, which is based on the HTML5 Boilerplate v5.0.0 CSS normalize.
* Refine the variables used for base styles.
* Refine build task so text replacement is no longer needed for cache-busting.
