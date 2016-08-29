fabmo-CutoffSawFence-app.fma: clean *.html js/* js/lib/*.js css/* icon.png  img/* fonts/* package.json
	zip fabmo-CutoffSawFence-app.fma *.html js/* js/lib/*.js css/* icon.png  img/* fonts/* package.json

.PHONY: clean

clean:
	rm -rf fabmo-CutoffSawFence-app.fma
