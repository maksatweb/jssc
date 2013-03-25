define(function(require, exports, module) {
	var Rule = require('./Rule'),
		LineSearch = require('../match/LineSearch'),
		CharacterSet = require('../match/CharacterSet'),
		LineParse = require('../match/LineParse'),
		CompleteEqual = require('../match/CompleteEqual'),
		RegMatch = require('../match/RegMatch'),
		Token = require('../Token'),
		Lexer = require('../Lexer'),
		character = require('../../util/character'),
		EcmascriptRule = Rule.extend(function() {
			var self = this;
			Rule.call(self, EcmascriptRule.KEYWORDS, true);
			
			self.addMatch(new CompleteEqual(Token.BLANK, character.BLANK));
			self.addMatch(new CompleteEqual(Token.TAB, character.TAB));
			self.addMatch(new CompleteEqual(Token.ENTER, character.ENTER));
			self.addMatch(new CompleteEqual(Token.LINE, character.LINE));
			self.addMatch(new LineSearch(Token.COMMENT, '//', '\n'));
			self.addMatch(new LineSearch(Token.COMMENT, '/*', '*/', true));
			self.addMatch(new LineParse(Token.STRING, '"', '"', false, Lexer.IS_REG));
			self.addMatch(new LineParse(Token.STRING, "'", "'", false, Lexer.IS_REG));
			self.addMatch(new LineParse(Token.TEMPLATE, '`', '`', true, Lexer.IS_REG));
			self.addMatch(new CharacterSet(Token.ID, [
				CharacterSet.LETTER,
				CharacterSet.UNDERLINE,
				CharacterSet.DOLLAR
			], [
				CharacterSet.LETTER,
				CharacterSet.UNDERLINE,
				CharacterSet.DOLLAR,
				CharacterSet.DIGIT
			], Lexer.SPECIAL));
			self.addMatch(new RegMatch(Token.NUMBER, /^\.\d+(?:E[+-]?\d+)?/, Lexer.NOT_REG));
			['~', '!', '*=', '/=', '+=', '-=', '%=', '^=', '&=', '|=', '%', '^', '&&', '&', '*', '(', ')', '--', '-', '++', '+', '===', '==', '=', '!==', '!=', '[', ']', '{', '}', '||', '|', '\\', '>>>=', '<<<=', '<<<', '>>>', '>>=', '<<=', '<<', '>>', '>=', '<=', '<', '>', ',', '...', '.', '?:', '?', ':', ';', '/'].forEach(function(o) {
				self.addMatch(new CompleteEqual(Token.SIGN, o, Lexer.IS_REG));
			});
			self.addMatch(new RegMatch(Token.NUMBER, /^\d+\.?\d*(?:E[+-]?\d+)?/, Lexer.NOT_REG));
		}).statics({
			KEYWORDS: 'if else for break case continue function true use switch default do while int float double long short char null public super in false abstract boolean Boolean byte class const debugger delete static void synchronized this import enum export extends final finally goto implements protected throw throws transient instanceof interface native new package private try typeof var volatile Vector with document window return Function String Date Array Object RegExp Event Math Number decodeURI decodeURIComponent encodeURI encodeURIComponent escape isFinite isNaN namespace isXMLName parseFloat parseInt trace uint unescape XML XMLList undefined Infinity NaN module'.split(' ')
		});
	module.exports = EcmascriptRule;
});