# Repsel

Quickly replace only words within a selection.

## Usage

1. Select the range that contains the word(s) you want to replace.
1. Launch `Replace in Selection` command. Default shortcut key is `alt+s`.
1. Enter the before-replacement word to the first text box. Then press the `Enter` to confirm.
1. Enter the after-replacement word to the second text box, and press the `Enter`.
1. Complete!

## Settings

Name|Description|Type|Default|Example
-|-|-|-|-
highlightColor|Background color for highlighted words.<br>You can use CSS colors or Hex color.|string|`green`|`red`<br>`#ff0000`
regexpFlags|Flags used in regular expression to search target words.<br>[Lean about flags - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)|string|`g`|`igm`