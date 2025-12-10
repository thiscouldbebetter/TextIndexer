
class UiEventHandler
{
	static buttonFind_Clicked()
	{
		var d = document;

		var textareaIndex = d.getElementById("textareaIndex");
		var indexAsText = textareaIndex.value;
		var index = TextDocumentIndex.fromText(indexAsText);

		var inputWordsToFind = d.getElementById("inputWordsToFind");
		var wordsAsString = inputWordsToFind.value.trim();
		var wordsToFind = wordsAsString.split(" ").filter(x => x.length > 0);

		var linesContainingWordsAsNumbers =
			index.findOffsetsOfLinesContainingWords(wordsToFind);

		var textDocument = TextDocument.fromDomDocument(d);

		var selectIndexType =
			d.getElementById("selectIndexType");
		var indexTypeName = selectIndexType.value;

		var searchResults = "[No matches found.]";

		if (indexTypeName == "Full Text")
		{
			var linesContainingWords =
				textDocument.linesForNumbers(linesContainingWordsAsNumbers);

			var blankLine = "\n\n";
			var linesContainingWordsAsText =
				linesContainingWords.join(blankLine);

			searchResults = linesContainingWordsAsText;
		}
		else
		{
			var textIndexed = textDocument.content; // todo - Read partially from file?
			var newline = "\n";
			var textIndexedAsLines = textIndexed.split(newline);

			var articlesMatchingAsLinesSoFar = [];

			var lineNumbersOfMatchingArticleTitles = linesContainingWordsAsNumbers;

			for (var i = 0; i < lineNumbersOfMatchingArticleTitles.length; i++)
			{
				var articleLinesSoFar = [];

				var lineNumber =
					lineNumbersOfMatchingArticleTitles[i];

				var linesBlankInARowSoFar = 0;
				while (lineNumber < textIndexedAsLines.length && linesBlankInARowSoFar < 2)
				{
					var line = textIndexedAsLines[lineNumber];
					if (line == "")
					{
						linesBlankInARowSoFar++;
					}
					else
					{
						linesBlankInARowSoFar = 0;

						articleLinesSoFar.push(line);
					}

					lineNumber++;
				}

				articlesMatchingAsLinesSoFar.push(...articleLinesSoFar);
			}

			var newline = "\n";
			var articlesMatchingAsText =
				articlesMatchingAsLinesSoFar.join(newline);

			searchResults = articlesMatchingAsText;
		}

		var textareaLinesContainingSpecifiedWords =
			d.getElementById("textareaLinesContainingSpecifiedWords");

		textareaLinesContainingSpecifiedWords.value = searchResults;
	}

	static buttonGenerate_Clicked()
	{
		var d = document;

		var textDocumentToIndex = TextDocument.fromDomDocument(d);

		var selectIndexType =
			d.getElementById("selectIndexType");
		var indexTypeName = selectIndexType.value;

		var indexer = new TextDocumentIndexer(indexTypeName);
		var indexGenerated =
			indexer.indexGenerateForTextDocument(textDocumentToIndex);

		var indexGeneratedAsText = indexGenerated.toText();

		var textareaIndex = d.getElementById("textareaIndex");
		textareaIndex.value = indexGeneratedAsText;
	}

	static buttonIndexGeneratedClear_Clicked()
	{
		var d = document;
		var textareaIndex = d.getElementById("textareaIndex");
		textareaIndex.value = "";
	}

	static inputFile_Changed(inputFile)
	{
		var fileToLoad = inputFile.files[0];

		if (fileToLoad != null)
		{
			var fileReader = new FileReader();
			fileReader.onload = (event) =>
			{
				var fileText = event.target.result;
				var d = document;

				var inputTitle = d.getElementById("inputTitle");
				inputTitle.value = fileToLoad.name;

				var textareaTextToIndex =
					d.getElementById("textareaTextToIndex");
				textareaTextToIndex.value = fileText;
			};
			fileReader.readAsText(fileToLoad);
		}
	}

	static buttonTextToIndexClear_Clicked()
	{
		var d = document;

		var inputFile = d.getElementById("inputFile");
		inputFile.files.length = 0;

		var inputTitle = d.getElementById("inputTitle");
		inputTitle.value = "[untitled]";

		var textareaTextToIndex =
			d.getElementById("textareaTextToIndex");
		textareaTextToIndex.value = "";
	}
}
