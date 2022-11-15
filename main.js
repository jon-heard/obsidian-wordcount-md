// WordCountMd - A plugin to count the NON-MARKDOWN words of selected text in the editor.

'use strict';

var obsidian = require('obsidian');
var state = require('@codemirror/state');
var view = require('@codemirror/view');

class WordCountMd extends obsidian.Plugin
{
	onload()
	{
		WordCountMd .statusBar = this.addStatusBarItem();
		this.createCMExtension();
	}

	createCMExtension()
	{
		const cmStateField = state.StateField.define(
		{
			create(state)
			{
				return view.Decoration.none;
			},
			update(effects, tr)
			{
				let text = "";
				const selection = tr.newSelection.main;
				if (selection.empty)
				{
					const textIter = tr.newDoc.iter();
					while (!textIter.done)
					{
						text = text + textIter.next().value;
					}
				}
				else
				{
					const textIter = tr.newDoc.iterRange(selection.from, selection.to);
					while (!textIter.done)
					{
						text = text + textIter.next().value;
					}
				}
				WordCountMd.updateStatusBar(text);
				return effects;
			},
			provide: (f) => view.EditorView.decorations.from(f),
		});

		this.registerEditorExtension(cmStateField);
	}

	// word separators - space/tab, forward-slash, comma
	static REGEX_SPACES = "\\s\\/,";
	// word - 0 or more non-separators, an alphanumeric, 0 or more non-separators
	static REGEX_WORDS = new RegExp(`[^${this.REGEX_SPACES}]*[a-zA-Z0-9][^${this.REGEX_SPACES}]*`, "g");
	static updateStatusBar(text)
	{
		const words = text?.match(this.REGEX_WORDS)?.length || 0;
		const chars = text.length;
		this.statusBar.setText(`${words} words ${chars} characters`);
	}
}

module.exports = WordCountMd;
