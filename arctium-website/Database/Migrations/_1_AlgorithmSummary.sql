create table algorithm_summary(
algorithm_name text,
standard_name text,
standard_website_url text,
arctium_website_documentation_url text,
[group] text,
[status] int
);

--0 - implemenet, 1-partial , 2-todo, 3-notimple

insert into algorithm_summary(algorithm_name, standard_name, standard_website_url, arctium_website_documentation_url, [group], [status])
values
('TLS 1.1', '[RFC 4346]', 'https://www.ietf.org/rfc/rfc4346.txt', 'tls11', 'tls', 0),
('TLS 1.2', '[RFC 5246]', 'https://www.ietf.org/rfc/rfc5246.txt', 'tls12', 'tls', 1),
('TLS 1.3', '[RFC 8446]', 'https://tools.ietf.org/html/rfc8446', 'tls13', 'tls', 2),
('ECC Crypto (2006)', '[RFC 4492]', 'https://tools.ietf.org/html/rfc4492', 'elliptic-curve', 'ecc', 2),
('ECC Crypto (2018)', '[RFC 8422]', 'https://tools.ietf.org/html/rfc8422', 'elliptic-curve', 'ecc', 2),
('TLS Extensions', '[RFC 6066]', 'https://tools.ietf.org/html/rfc6066', 'tls-extensions', 'tls-extensions', 1),
('ALPN' ,'[RFC 7301]', 'https://tools.ietf.org/html/rfc7301', 'tls-extensions', 'tls-extensions', 1),
('Negotiated FFDHE Parameters', '[RFC 7919]', 'https://tools.ietf.org/html/rfc7919', 'other', 'other', 2)