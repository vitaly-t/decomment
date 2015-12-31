1. Closing ' and " shouldn't be searched for beyond the next end of line.

2. Locating all regular expressions on any given line;

3. When analyzing for comments being not inside text, I am missing tests for html comments
    being inside text;
    
4. Example that can break the existing code: var a = /[a-b//]text/, b = /[a-b/*]text/;
    it will make the wrong assumption about both `//` and `/*`
    This means
    
    