fabmo-CutoffSawFence-app.fma: clean *.html json/*.json js/* js/lib/*.js css/* icon.png  img/* fonts/* package.json
	zip fabmo-CutoffSawFence-app.fma *.html json/*.json js/* js/lib/*.js css/* icon.png  img/* fonts/* package.json

.PHONY: clean

clean:
	rm -rf fabmo-CutoffSawFence-app.fma
