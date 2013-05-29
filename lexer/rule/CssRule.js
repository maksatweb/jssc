define(function(require, exports, module) {
	var Rule = require('./Rule'),
		LineSearch = require('../match/LineSearch'),
		LineParse = require('../match/LineParse'),
		CompleteEqual = require('../match/CompleteEqual'),
		RegMatch = require('../match/RegMatch'),
		Token = require('../Token'),
		character = require('../../util/character'),
		CssRule = Rule.extend(function() {
			var self = this;
			Rule.call(self, CssRule.KEYWORDS);

			self.vl = {};
			CssRule.VALUES.forEach(function(o) {
				self.vl[o] = true;
			});
			
			self.addMatch(new CompleteEqual(Token.BLANK, character.BLANK));
			self.addMatch(new CompleteEqual(Token.TAB, character.TAB));
			self.addMatch(new CompleteEqual(Token.ENTER, character.ENTER));
			self.addMatch(new CompleteEqual(Token.LINE, character.LINE));

			self.addMatch(new LineSearch(Token.COMMENT, '/*', '*/', true));
			self.addMatch(new LineParse(Token.STRING, '"', '"', false));
			self.addMatch(new LineParse(Token.STRING, "'", "'", false));
			
			self.addMatch(new RegMatch(Token.NUMBER, /^-\d+\.?\d*[a-z%]*/i));

			self.addMatch(new RegMatch(Token.ID, /^[a-z_\-*][\w\-_]+(?:(?:\\\d)|(?:!important))?/i));

			self.addMatch(new RegMatch(Token.NUMBER, /^\.\d+[a-z%]*/i));

			['{', '}', ',', ';', ':', '-', '(', ')'].forEach(function(o) {
				self.addMatch(new CompleteEqual(Token.SIGN, o));
			});
			self.addMatch(new CompleteEqual(Token.HEAD, '@import'));

			self.addMatch(new RegMatch(Token.NUMBER, /^#[\da-f]{6}/i));
			self.addMatch(new RegMatch(Token.NUMBER, /^#[\da-f]{3}/i));
			self.addMatch(new RegMatch(Token.NUMBER, /^\d+\.?\d*[a-z%]*/i));
			
			self.addMatch(new RegMatch(Token.ID, /^[.#]?[a-z_][\w\-_]*/i));
		}).methods({
			values: function() {
				return this.vl;
			}
		}).statics({
			KEYWORDS: 'ascent azimuth background-attachment background-color background-image background-position background-repeat background baseline bbox border-collapse border-color border-spacing border-style border-top border-right border-bottom border-left border-top-color border-right-color border-bottom-color border-left-color border-top-style border-right-style border-bottom-style border-left-style border-top-width border-right-width border-bottom-width border-left-width border-width border bottom cap-height caption-side centerline clear clip color content counter-increment counter-reset cue-after cue-before cue cursor definition-src descent direction display elevation empty-cells float font-size-adjust font-family font-size font-stretch font-style font-variant font-weight font height left letter-spacing line-height list-style-image list-style-position list-style-type list-style margin-top margin-right margin-bottom margin-left margin marker-offset marks mathline max-height max-width min-height min-width orphans outline-color outline-style outline-width outline overflow padding-top padding-right padding-bottom padding-left padding page page-break-after page-break-before page-break-inside pause pause-after pause-before pitch pitch-range play-during position quotes right richness size slope src speak-header speak-numeral speak-punctuation speak speech-rate stemh stemv stress table-layout text-align top text-decoration text-indent text-shadow text-transform unicode-bidi unicode-range units-per-em vertical-align visibility voice-family volume white-space widows width widths word-spacing x-height z-index'.split(' '),
			VALUES: 'above absolute all always aqua armenian attr aural auto avoid baseline behind below bidi-override black blink block blue bold bolder both bottom braille capitalize caption center center-left center-right circle close-quote code collapse compact condensed continuous counter counters crop cross crosshair cursive dashed decimal decimal-leading-zero default digits disc dotted double embed embossed e-resize expanded extra-condensed extra-expanded fantasy far-left far-right fast faster fixed format fuchsia gray green groove handheld hebrew help hidden hide high higher icon inline-table inline inset inside invert italic justify landscape large larger left-side left leftwards level lighter lime line-through list-item local loud lower-alpha lowercase lower-greek lower-latin lower-roman lower low ltr marker maroon medium message-box middle mix move narrower navy ne-resize no-close-quote none no-open-quote no-repeat normal nowrap n-resize nw-resize oblique olive once open-quote outset outside overline pointer portrait pre print projection purple red relative repeat repeat-x repeat-y rgb ridge right right-side rightwards rtl run-in screen scroll semi-condensed semi-expanded separate se-resize show silent silver slower slow small small-caps small-caption smaller soft solid speech spell-out square s-resize static status-bar sub super sw-resize table-caption table-cell table-column table-column-group table-footer-group table-header-group table-row table-row-group teal text-bottom text-top thick thin top transparent tty tv ultra-condensed ultra-expanded underline upper-alpha uppercase upper-latin upper-roman url visible wait white wider w-resize x-fast x-high x-large x-loud x-low x-slow x-small x-soft xx-large xx-small yellow'.split(' ')
		});
	module.exports = CssRule;
});