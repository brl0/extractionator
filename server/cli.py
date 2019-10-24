#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Console script for pagefunc.
If the module has a command line interface then this
file should be the entry point for that interface.
"""

from collections import OrderedDict
from pathlib import Path
from pprint import pprint
import sys

import click

from pagefunc import *
from query import query_url
from schema import extract
from bripy.bllb.bllb_logging import DBG, logger, setup_logging

@click.command(context_settings=dict(ignore_unknown_options=True, ))
@click.option('-f',
              '--file',
              type=click.Path(exists=True,
                              file_okay=True,
                              dir_okay=True,
                              writable=False,
                              readable=True,
                              resolve_path=True,
                              allow_dash=False),
              default=None,
              multiple=True,
              help='Text file url list to process.')
@click.option('-u',
              '--url',
              default=None,
              multiple=True,
              help='URL to process.')
@click.option('-d',
              '--debug',
              is_flag=True,
              default=False,
              help='Enable debug.')
def main(file, url, debug):
    """Console script for pagefunc."""
    # See click documentation at http://click.pocoo.org/
    if debug:
        logger = setup_logging("DEBUG")
    urls = []
    urls.extend(url)
    if file is not None and len(file):
        for f in map(Path, file):
            urls.extend([
                u.strip() for u in f.read_text().split('\n') if len(u.strip())
            ])
    if not len(urls):
        logger.warning('No URLs were given.')
        ctx = click.get_current_context()
        click.echo(ctx.get_help())
        ctx.exit()
    for url in urls:
        print(url)
        output = extract(url)
        print(type(output))
        print(output.keys())
        pprint(output)
    return 0


if __name__ == "__main__":
    sys.exit(main())  # pragma: no cover
