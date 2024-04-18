package utils

type zero struct{} // Empty stuct, 0 byte

// Set is a data structure like Python
type Set struct {
	Content map[string]zero
}

func NewSet() *Set {
	s := &Set{}
	s.Content = make(map[string]zero)
	return s
}

func (s *Set) Has(v string) bool {
	_, ok := s.Content[v]
	return ok
}

func (s *Set) Add(v string) {
	s.Content[v] = zero{}
}

func (s *Set) AddList(l *[]string) {
	for _, v := range *l {
		s.Add(v)
	}
}

func (s *Set) Remove(v string) {
	delete(s.Content, v)
}

func (s *Set) Size() int {
	return len(s.Content)
}

func (s *Set) Clear() {
	s.Content = make(map[string]zero)
}

func (s *Set) Union(s2 *Set) *Set {
	ns := NewSet()
	for v := range s.Content {
		ns.Add(v)
	}
	for v := range s2.Content {
		ns.Add(v)
	}
	return ns
}

func (s *Set) Intersect(s2 *Set) *Set {
	ns := NewSet()
	for v := range s.Content {
		if s2.Has(v) {
			ns.Add(v)
		}
	}
	return ns
}

func (s *Set) Difference(s2 *Set) *Set {
	ns := NewSet()
	for v := range s.Content {
		if s2.Has(v) {
			continue
		}
		ns.Add(v)
	}
	return ns
}
