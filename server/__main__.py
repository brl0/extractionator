#!/usr/bin/env python3
# -*- coding: utf-8 -*-
""" This is the entry point for if your module is
executed like this: ``python -m pagefunc``. """

import sys
try:
    from .cli import main
except:
    from cli import *

if __name__ == '__main__':
    sys.exit(main())  # pragma: no cover
