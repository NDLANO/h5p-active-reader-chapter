/** @namespace H5PUpgrades */
var H5PUpgrades = H5PUpgrades || {};

H5PUpgrades['H5P.ActiveReaderChapter'] = (function () {
  return {
    1: {
      /**
       * Asynchronous content upgrade hook.
       * Fix potentially missing subContentId.
       * @param {object} parameters Parameters.
       * @param {function} finished Callback.
       * @param {object} extras Extra parameters.
       */
      3: function (parameters, finished, extras) {
        // NOTE: We avoid using H5P.createUUID since this is an upgrade script and H5P function may change in the future
        const getSubContentId = () => {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
            .replace(/[xy]/g, (char) => {
                const random = Math.random()*16|0;
                const newChar = (char === 'x') ?
                  random :
                  (random&0x3|0x8);
                return newChar.toString(16);
            });
        };

        if (parameters?.content && Array.isArray(parameters.content)) {
          parameters.content = parameters.content.map((content) => {
            if (!content.content) {
              return content;
            }

            const newContent = {
              useSeparator: content.useSeparator,
              content: {
                params: {
                  placeholder: {
                    colorEditorField: '#1768c4',
                    arrangement: '1',
                    colorBackground: 'rgba(0, 0, 0, 0)',
                    fields: [
                      {
                        isHidden: false,
                        verticalAlignment: 'top',
                        width: 100,
                        content: content.content
                      }
                    ]
                  }
                },
                library: 'H5P.ActiveReaderPlaceholder 1.0',
                metadata: {
                  contentType: 'Active Reader Placeholder',
                  license: 'U',
                  title: content.content.metadata?.title ?? 'Untitled Placeholder',
                  authors: content.content.metadata?.authors ?? [],
                  changes: content.content.metadata?.changes ?? [],
                },
                subContentId: getSubContentId()
              }
             };
            return newContent;
          });
        }

        // Done
        finished(null, parameters, extras);
      }
    }
  };
})();
