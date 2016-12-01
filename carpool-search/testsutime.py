import os
import json
from sutime import SUTime

if __name__ == '__main__':
    test_case = u'I need a desk for tomorrow from 2pm to 3pm'

    jar_files = 'C:\Users\Leandra\Anaconda2\lib\site-packages\sutime\jars'
    jar_files = 'C:\Users\Leandra\Documents\Fall2016\NLP\carpool-search\jars'
    print(jar_files)
    sutime = SUTime(jars=jar_files, mark_time_ranges=True)

    print(json.dumps(sutime.parse(test_case), sort_keys=True, indent=4))