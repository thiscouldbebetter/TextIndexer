
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

		var linesContainingWords =
			textDocument.linesForNumbers(linesContainingWordsAsNumbers);
		var blankLine = "\n\n";
		var linesContainingWordsAsText =
			linesContainingWords.join(blankLine);

		var textareaLinesContainingSpecifiedWords =
			d.getElementById("textareaLinesContainingSpecifiedWords");
		textareaLinesContainingSpecifiedWords.value = linesContainingWordsAsText;
	}

	static buttonGenerate_Clicked()
	{
		var d = document;

		var textDocumentToIndex = TextDocument.fromDomDocument(d);

		var indexer = new TextDocumentIndexer();
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
