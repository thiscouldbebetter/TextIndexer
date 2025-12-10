
class TextDocumentIndexer
{
	indexGenerateForTextDocument(textDocumentToIndex)
	{
		var textAsLinesOfWords =
			this.indexGenerateForTextDocument_1(textDocumentToIndex);

		var lineAndCharOffsetPairsByWord =
			this.indexGenerateForTextDocument_2(textAsLinesOfWords);

		var lineAndCharOffsetPairsByWordSorted =
			new Map( [...lineAndCharOffsetPairsByWord.entries() ].sort() );

		var textDocumentIndex = new TextDocumentIndex
		(
			textDocumentToIndex.title,
			lineAndCharOffsetPairsByWordSorted
		);

		return textDocumentIndex;
	}

	indexGenerateForTextDocument_1(textDocumentToIndex)
	{
		var textToIndex = textDocumentToIndex.content;

		var textLowercase = textToIndex.toLowerCase();

		var newline = "\n";
		var textAsLines = textLowercase.split(newline);
		var textAsLinesTrimmed = textAsLines.map(x => x.trim());

		var textAsLinesOfTokens = textAsLinesTrimmed.map(x => x.split(" "));

		var charCode_A = "A".charCodeAt(0);
		var charCode_Z = "Z".charCodeAt(0);
		var charCode_a = "a".charCodeAt(0);
		var charCode_z = "z".charCodeAt(0);
 
		var textAsLinesOfWords = textAsLinesOfTokens.map
		(
			tokensOnLine =>
			{
				var wordsOnLine = tokensOnLine.map
				(
					token =>
					{
						var tokenLetters = token.split("").filter
						(
							character =>
							{
								var charCode = character.charCodeAt(0);
								var isCharALetter =
								(
									(
										charCode >= charCode_A
										&& charCode <= charCode_Z
									)
									||
									(
										charCode >= charCode_a
										&& charCode <= charCode_z
									)
								);
								return isCharALetter;
							}
						);

						var tokenMinusNonLetters = tokenLetters.join("");

						return tokenMinusNonLetters;
					}
				).filter(x => x.length > 0);

				return wordsOnLine;
			}
		);

		return textAsLinesOfWords;
	}

	indexGenerateForTextDocument_2(textAsLinesOfWords)
	{
		var lineAndCharOffsetPairsByWord = new Map();

		for (var i = 0; i < textAsLinesOfWords.length; i++)
		{
			var wordsOnLine = textAsLinesOfWords[i];

			for (var w = 0; w < wordsOnLine.length; w++)
			{
				var word = wordsOnLine[w];

				if (lineAndCharOffsetPairsByWord.has(word) == false)
				{
					lineAndCharOffsetPairsByWord.set(word, []);
				}

				var lineAndCharOffsetPairsForWord
					= lineAndCharOffsetPairsByWord.get(word);

				lineAndCharOffsetPairsForWord.push( [i, w ] );
			}
		}

		return lineAndCharOffsetPairsByWord;
	}

}
