define(function(require, exports, module) {
	var Lexer = require('./Lexer'),
		Token = require('./Token'),
		character = require('../util/character'),
		CssLexer = Lexer.extend(function(rule) {
			Lexer.call(this, rule);
			this.isValue = false;
			this.parenthese = false;
			this.family = false;
		}).methods({
			//@override
			scan: function(temp) {
				var length = this.code.length,
					count = 0;
				outer:
				while(this.index < length) {
					if(this.cacheLine > 0 && count >= this.cacheLine) {
						break;
					}
					this.readch();
					for(var i = 0, matches = this.rule.matches(), len = matches.length; i < len; i++) {
						var match = matches[i];
						if(match.match(this.peek, this.code, this.index)) {
							var token = new Token(match.tokenType(), match.content(), match.val()),
								matchLen = match.content().length;
							//(֮����ַ�����ʡ��"��
							if(this.parenthese) {
								if([Token.BLANK, Token.TAB, Token.LINE, Token.ENTER].indexOf(token.type()) != -1) {
									//
								}
								else if(token.type() == Token.STRING) {
									//
								}
								else if(token.content() == ')') {
									this.parenthese = false;
								}
								else {
									this.dealPt(temp);
									continue outer;
								}
							}
							if(token.type() == Token.ID) {
								//ie hackҲ��ؼ���
								if(/[*\-_]/.test(token.content().charAt(0))) {
									if(this.rule.keyWords().hasOwnProperty(token.content().slice(1))) {
										token.type(Token.KEYWORD);
									}
								}
								else {
									//�����Ժ�ֵ
									if(this.rule.keyWords().hasOwnProperty(token.content())) {
										token.type(Token.KEYWORD);
									}
									else {
										var s = token.content();
										if(/\\\d$/.test(s)) {
											s = s.slice(0, s.length - 2);
										}
										else if(/!important$/.test(s)) {
											s = s.slice(0, s.length - 10);
										}
										if(this.rule.values().hasOwnProperty(s) || this.family) {
											token.type(Token.PROPERTY);
										}
									}
								}
							}
							if(token.type() == Token.HEAD && token.content() == '@import') {
								this.isValue = true;
							}
							else if(token.type() == Token.SIGN) {
								if(token.content() == ':') {
									this.isValue = true;
								}
								else if(token.content() == ';' || token.content == '}') {
									this.isValue = false;
									this.family = false;
								}
								else if(token.content() == '(') {
									this.parenthese = true;
								}
							}
							else if(token.type() == Token.KEYWORD && ['font-family', 'font'].indexOf(token.content().toLowerCase()) != -1) {
								this.family = true;
							}
							if(token.type() == Token.PROPERTY && !this.isValue) {
								break;
							}
							if(token.type() == Token.NUMBER && !this.isValue) {
								token.type(Token.ID);
							}
							temp.push(token);
							this.tokenList.push(token);
							this.index += matchLen - 1;
							var n = character.count(token.val(), character.LINE);
							count += n;
							this.totalLine += n;
							if(n) {
								var i = match.content().indexOf(character.LINE),
									j = match.content().lastIndexOf(character.LINE);
								this.colMax = Math.max(this.colMax, this.colNum + i);
								this.colNum = match.content().length - j;
							}
							else {
								this.colNum += matchLen;
							}
							this.colMax = Math.max(this.colMax, this.colNum);
							continue outer;
						}
					}
					if(this.parenthese) {
						this.dealPt(temp);
						continue outer;
					}
					//�����δƥ��ģ�cssĬ�Ϻ��ԣ�������һ��;
					var j = this.code.indexOf(';', this.index);
					if(j == -1) {
						j = this.code.length;
					}
					var s = this.code.slice(this.index - 1, j);
					var token = new Token(Token.VIRTUAL, s);
					temp.push(token);
					this.tokenList.push(token);
					this.index = j;
				}
				return this;
			},
			dealPt: function(temp) {
				var k = this.code.indexOf(')', this.index);
				//()δ����ֱ������
				if(k == -1) {
					this.index = this.code.length;
					return;
				}
				var s = this.code.slice(this.index - 1, k),
					reg = /[\s\r\n]+\)$/.exec(s);
				//)֮ǰ�Ŀհ�Ҫ�ж�
				if(reg) {
					s = s.slice(0, s.length - reg[0].length);
				}
				var token = new Token(Token.STRING, s);
				temp.push(token);
				this.tokenList.push(token);
				this.index += s.length - 1;
				this.parenthese = false;
			}
		});
	module.exports = CssLexer;
});