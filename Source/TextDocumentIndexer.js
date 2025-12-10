
class TextDocumentIndexer
{
	constructor(indexTypeName)
	{
		this.indexTypeName = indexTypeName;
	}

	indexGenerateForTextDocument(textDocumentToIndex)
	{
		var indexGenerated = null;
		if (this.indexTypeName == "Full Text")
		{
			indexGenerated =
				this.indexGenerateForTextDocument_FullText(textDocumentToIndex)
		}
		else if (this.indexTypeName == "Article Titles")
		{
			indexGenerated =
				this.indexGenerateForTextDocument_ArticleTitles(textDocumentToIndex);
		}
		else
		{
			throw new Error("Unrecognized index type name: " + this.indexTypeName);
		}

		return indexGenerated;
	}

	indexGenerateForTextDocument_ArticleTitles(textDocumentToIndex)
	{
		var lineNumberArraysByArticleTitleSoFar = new Map();

		var textToIndex = textDocumentToIndex.content;

		var newline = "\n";

		var lines = textToIndex.split(newline);
		var linesBlankInARowSoFar = 0;

		for (var i = 0; i < lines.length; i++)
		{
			var line = lines[i];

			if (line == "")
			{
				linesBlankInARowSoFar++;
			}
			else 
			{
				if (linesBlankInARowSoFar >= 2)
				{
					var articleTitle = line.toLowerCase();

					if (lineNumberArraysByArticleTitleSoFar.has(articleTitle) == false)
					{
						lineNumberArraysByArticleTitleSoFar.set(articleTitle, [] );
					}
					var lineNumberAsArray = [i]; // No char offset for these.
					var lineNumbersForArticleTitle =
						lineNumberArraysByArticleTitleSoFar.get(articleTitle);
					lineNumbersForArticleTitle
						.push(lineNumberAsArray);
				}

				linesBlankInARowSoFar = 0;
			}
		}

		// todo - Sorting, but if a pre-alphabetized set of articles like a 
		// dictionary is being indexed, that'll just be a waste of time.

		var textDocumentIndex = new TextDocumentIndex
		(
			textDocumentToIndex.title,
			lineNumberArraysByArticleTitleSoFar
		);

		return textDocumentIndex;
	}

	indexGenerateForTextDocument_FullText(textDocumentToIndex)
	{
		var textAsLinesOfWords =
			this.indexGenerateForTextDocument_FullText_1(textDocumentToIndex);

		var lineAndCharOffsetPairsByWord =
			this.indexGenerateForTextDocument_FullText_2(textAsLinesOfWords);

		var lineAndCharOffsetPairsByWordSorted =
			new Map( [...lineAndCharOffsetPairsByWord.entries() ].sort() );

		var textDocumentIndex = new TextDocumentIndex
		(
			textDocumentToIndex.title,
			lineAndCharOffsetPairsByWordSorted
		);

		return textDocumentIndex;
	}

	indexGenerateForTextDocument_FullText_1(textDocumentToIndex)
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

	indexGenerateForTextDocument_FullText_2(textAsLinesOfWords)
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
