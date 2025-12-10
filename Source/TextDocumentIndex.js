
class TextDocumentIndex
{
	constructor(documentTitle, lineAndCharOffsetPairsByWord)
	{
		this.documentTitle = documentTitle;
		this.lineAndCharOffsetPairsByWord = lineAndCharOffsetPairsByWord;
	}

	findOffsetsOfLinesContainingWords(wordsToFind)
	{
		var offsetsOfLinesContainingEachWord =
			wordsToFind.map(
				word =>
					this.lineAndCharOffsetPairsByWord.get(word).map(x => x[0] )
			);

		var offsetsOfLinesContainingAllWordsSoFar =
			offsetsOfLinesContainingEachWord[0] || [];

		for (var i = 1; i < wordsToFind.length; i++)
		{
			var wordCurrent = wordsToFind[i];
			var lineOffsetsForWordCurrent =
				offsetsOfLinesContainingEachWord[i];
			offsetsOfLinesContainingAllWordsSoFar =
				offsetsOfLinesContainingAllWordsSoFar
					.filter(x => lineOffsetsForWordCurrent.indexOf(x) >= 0 );
		}

		return offsetsOfLinesContainingAllWordsSoFar;
	}

	// To and from text.

	static fromText(indexAsText)
	{
		var blankLine = "\n\n";
		var wordEntriesAsStrings = indexAsText.split(blankLine);

		var wordsAndLineAndCharOffsetPairs = wordEntriesAsStrings.map
		(
			wordEntryAsString =>
			{
				var indexOfFirstSpace = wordEntryAsString.indexOf(" ");
				var word = wordEntryAsString.substr(0, indexOfFirstSpace);
				var lineAndCharOffsetPairsAsString =
					wordEntryAsString.substr(indexOfFirstSpace);
				var lineAndCharOffsetPairsAsStrings =
					lineAndCharOffsetPairsAsString.split(", ");
				var lineAndCharOffsetPairs = lineAndCharOffsetPairsAsStrings.map
				(
					lineAndCharOffsetAsString =>
						lineAndCharOffsetAsString.split(":").map(x => parseInt(x) )
				);
				var wordAndLineAndCharOffsetPairs = [word, lineAndCharOffsetPairs];
				return wordAndLineAndCharOffsetPairs
			}
		);

		var lineAndCharOffsetPairsByWord =
			new Map(wordsAndLineAndCharOffsetPairs);

		var index = new TextDocumentIndex
		(
			"[unknown]", // title
			lineAndCharOffsetPairsByWord
		);

		return index;
	}

	toText()
	{
		var linesSoFar = [];

		var wordsAsEnumeration = this.lineAndCharOffsetPairsByWord.keys();
		while (true)
		{
			var enumerationResult = wordsAsEnumeration.next();
			if (enumerationResult.done)
			{
				break;
			}
			else
			{
				var word = enumerationResult.value;

				var lineAndCharOffsetPairsForWord =
					this.lineAndCharOffsetPairsByWord.get(word);

				var lineAndCharOffsetPairsForWordAsText =
					lineAndCharOffsetPairsForWord.map(
						x => x[0] + (x.length != 2 ? "" : ":" + x[1])
					).join(", ");

				linesSoFar.push(word + " " + lineAndCharOffsetPairsForWordAsText);
			}
		}

		var blankLine = "\n\n";
		var indexAsText = linesSoFar.join(blankLine);

		return indexAsText;
	}
}
