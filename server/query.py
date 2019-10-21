import pprint
import schema


def make_query(url, parts):
    q = """
    {
      website (url: "URL" ) {
        PARTS
      }
    }
    """
    q = q.replace("URL", url)
    q = q.replace("PARTS", parts)
    return q


def query_url(url, parts):
    q = make_query(url, parts)
    result = schema.schema.execute(q)
    if result.errors:
        if len(result.errors) == 1:
            raise Exception(result.errors[0])
        else:
            raise Exception(result.errors)
    return result.data


if __name__ == "__main__":
    results = query_url("https://lethain.com/migrations/",
    "url, title, image")
    pprint.pprint(results)
