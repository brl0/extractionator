import pprint
import schema
import sys

ALL_PARTS = "url,title,feed,image,description,text,qs"

def make_query(url, parts=ALL_PARTS):
    q = """{website(url:"URL"){PARTS}}"""
    q = q.replace("URL", url)
    q = q.replace("PARTS", parts)
    return q


def query_url(url, parts=ALL_PARTS):
    q = make_query(url, parts)
    result = schema.schema.execute(q)
    if result.errors:
        if len(result.errors) == 1:
            raise Exception(result.errors[0])
        else:
            raise Exception(result.errors)
    return result.data


def main(url="https://lethain.com/migrations/"):
    results = query_url(url)
    pprint.pprint(results)
    return 0

if __name__ == "__main__":
    sys.exit(main())
