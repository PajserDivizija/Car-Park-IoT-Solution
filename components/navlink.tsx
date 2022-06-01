import { Link, LinkProps } from '@chakra-ui/layout';
import { forwardRef } from '@chakra-ui/react';
import { useRouter } from 'next/router';

function NavLink(props, ref) {
  const router = useRouter();

  return (
    <Link
      ref={ref}
      aria-current={router.pathname === props.href ? 'page' : undefined}
      _activeLink={{ textDecoration: 'underline' }}
      {...props}
    />
  );
}

export default forwardRef<LinkProps, 'a'>(NavLink);
